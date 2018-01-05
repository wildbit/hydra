import Axios, { AxiosResponse, AxiosRequestConfig, AxiosBasicCredentials } from 'axios';
import * as papaparse from 'papaparse';
import Store from './Store';

function groupBy<T>(elements:T[], keySelector:((t:T)=>string)): object {
    let retval = {}
    elements.forEach(f => {
        let key = keySelector(f);
        retval[key] = retval[key] || [];
        retval[key].push(f);
    });
    return retval;
}

export class HAProxyInstance {
    private config: AxiosRequestConfig;
    display_name: string
    
    proxies: Proxy[] = [];

    constructor(url: string, username: string, password: string,
        timeout: number = 10, display_name: string = null) {
        this.config = <AxiosRequestConfig> {
            baseURL: url,
            timeout: timeout
        }

        if (username && password) {
            this.config.auth = <AxiosBasicCredentials>{
                username: username,
                password: password
            }        
        }
        this.display_name = display_name || url;

        //set an interval to pull proxy info.
    }

    async SendCommand(command: string): Promise<string>{
        let results = await <Promise<AxiosResponse<string>>>Axios.post('manage', command, this.config);
        return results.data;
    }

    async Proxies(): Promise<void> {
        try {
            let responses = papaparse.parse(await this.SendCommand('show stat'),
                    { comments: "#", dynamicTyping: true, skipEmptyLines: true }).data;
            
            var groups = groupBy(responses, f => f[0]);
            var retval: Proxy[] = [];
            for (let i in groups) {
                retval.push(new Proxy(this, i, (<any[]>groups[i]).map(r=> ProxyComponent.parse(this, r)) ));
            }
            this.proxies = retval;
            Store.instance.TriggerUpdate();
        }
        catch (err) {
            throw new Error("Unable to retrieve server info at this time.");
        }
    }
}

enum ProxyComponentType {
    backend,
    frontend,
    server,
    unknown
}

class ProxyComponent {
    /*
     This is the count of known HAProxy fields for this version of
     the UI. Newer versions of HAProxy may add more fields,
     and we'll add the getters for them as time goes on.
     Then, we'll increase this constant to reflect knowledge of 
     those getters. These are outlined, in detail, here: 
     http://cbonte.github.io/haproxy-dconv/1.8/management.html#9.1
    */
    static KNOWN_HAPROXY_FIELDS:number = 83;

    static parse(haproxyInstance:HAProxyInstance, stats: any[]): ProxyComponent {
        let retval: ProxyComponent;
        switch (stats[1]) {
            case "BACKEND":
                retval = new Backend();
                break;
            case "FRONTEND":
                retval = new Frontend();
                break;
            default:
                retval = new Server();
        }
        // Extend the stats array so that individual getters don't
        // need to check for a value first.
        while (stats.length < ProxyComponent.KNOWN_HAPROXY_FIELDS) { stats.push(null); }
        retval.stats = stats;
        retval.haproxyInstance = haproxyInstance;
        return retval;
    }
    protected stats: any[];
    protected haproxyInstance: HAProxyInstance;
    get component_type() { return ProxyComponentType.unknown; }
    get proxy_name(): string { return this.stats[0]; }
    get service_name(): string { return this.stats[1]; }
    get current_sessions(): number { return this.stats[4]; }
    get max_sessions():number { return this.stats[5];}
    get configured_session_limit():number { return this.stats[6];}
    get total_sessions():number { return this.stats[7];}
    get bytes_in():number { return this.stats[8];}
    get bytes_out():number { return this.stats[9];}
    get denied_responses():number { return this.stats[11];}
    get connection_errors():number { return this.stats[13];}
    get status():string { return this.stats[17];} // should use an enum -- probably.
    get process_id():string { return this.stats[26];}
    get proxy_id():string { return this.stats[27];}
    get type():number { return this.stats[32];}
    get rate():number { return this.stats[33];}
    get rate_max():number { return this.stats[35];}
    get http_responses_1xx():number { return this.stats[39];}
    get http_responses_2xx():number { return this.stats[40];}
    get http_responses_3xx():number { return this.stats[41];}
    get http_responses_4xx():number { return this.stats[42];}
    get http_responses_5xx():number { return this.stats[43];}
    get http_responses_other():number { return this.stats[44];}
    get mode():string { return this.stats[75];}
}

export class Proxy {
    private components: ProxyComponent[] = [];
    private haproxyInstance: HAProxyInstance;
    name: string;
    backend: Backend
    frontend: Frontend
    private _servers: Server[] = [];
    get servers(): Server[]{
        return this._servers;
    }

    constructor(haproxy: HAProxyInstance, name: string, components: ProxyComponent[]) {
        this.haproxyInstance = haproxy;
        this.name = components[0].proxy_name;
        this.components = components;
        this._servers = <Server[]> components.filter(k => k instanceof Server);
        //Either of these could be null, but that's OK.
        this.backend = <Backend>components.filter(k => k instanceof Backend).pop();
        this.frontend = <Frontend>components.filter(k => k instanceof Frontend).pop();
    }
}

export class Frontend extends ProxyComponent {
    get component_type() { return ProxyComponentType.frontend; }
    get denied_requests(): number { return this.stats[10]; }
    get request_errors(): number { return this.stats[12]; }
    get rate_limit(): number { return this.stats[34]; }
    get request_rate():number { return this.stats[46];}
    get request_rate_max():number { return this.stats[47];}
    get request_total(): number { return this.stats[48]; }
    get compressor_bytes_in():number { return this.stats[51];}
    get compressor_bytes_out():number { return this.stats[52];}
    get compressor_bytes_bypassed():number { return this.stats[53];}
    get compressed_response_count():number { return this.stats[54];}
    get connection_rate():number { return this.stats[77];}
    get connection_rate_max():number { return this.stats[78];}
    get connection_total(): number { return this.stats[79]; }
    get intercepted_requests():number { return this.stats[80];}
    get denied_tcp_connections():number { return this.stats[81];}
    get denied_tcp_sessions():number { return this.stats[82];}
}

export class Backend extends ProxyComponent {
    get component_type() { return ProxyComponentType.backend; }
    get current_queued_requests():number { return this.stats[2];}
    get queued_requests_max(): number { return this.stats[3]; }
    get denied_requests(): number { return this.stats[10]; }
    get response_errors(): number { return this.stats[14]; }
    get connection_retry_count():number { return this.stats[15];}
    get request_redispatch_count(): number { return this.stats[16]; }
    get total_weight():number { return this.stats[18];}
    get active_servers():number { return this.stats[19];}
    get backup_servers():number { return this.stats[20];}
    get health_check_transitions():number { return this.stats[22];}
    get last_status_change():number { return this.stats[23];}
    get downtime(): number { return this.stats[24]; }
    get load_balance_total():number { return this.stats[30];}
    get request_total(): number { return this.stats[48]; }
    get client_transfers_aborted():number { return this.stats[49];}
    get server_transfers_aborted(): number { return this.stats[50]; }
    get compressor_bytes_in():number { return this.stats[51];}
    get compressor_bytes_out():number { return this.stats[52];}
    get compressor_bytes_bypassed():number { return this.stats[53];}
    get compressed_response_count(): number { return this.stats[54]; }
    get last_session():number { return this.stats[55];}
    get average_queue_time():number { return this.stats[58];}
    get average_connect_time():number { return this.stats[59];}
    get average_response_time():number { return this.stats[60];}
    get average_total_session_time():number { return this.stats[61];}
    get cookie(): string { return this.stats[74]; }
    get load_balancing_algorithm():string { return this.stats[76];}
    get intercepted_requests():number { return this.stats[80];}
}

export class Server extends ProxyComponent{
    get component_type() { return ProxyComponentType.server; }
    get current_queued_requests():number { return this.stats[2];}
    get queued_requests_max(): number { return this.stats[3]; }
    get response_errors(): number { return this.stats[14]; }
    get connection_retry_count():number { return this.stats[15];}
    get request_redispatch_count():number { return this.stats[16];}
    get weight():number { return this.stats[18];}
    get is_active():boolean { return this.stats[19];}
    get is_backup():boolean { return this.stats[20];}
    get failed_checks():number { return this.stats[21];}
    get health_check_transitions():number { return this.stats[22];}
    get last_status_change():number { return this.stats[23];}
    get downtime():number { return this.stats[24];}
    get max_queue_per_server(): number { return this.stats[25]; }
    get server_id():string { return this.stats[28];}
    get throttle():number { return this.stats[29];}
    get load_balance_total():number { return this.stats[30];}
    get tracked(): string { return this.stats[31]; }
    get check_status(): string { return this.stats[36]; }
    get check_code():number { return this.stats[37];}
    get check_duration(): number { return this.stats[38]; }
    get failed_health_check_details(): string { return this.stats[45]; }
    get client_transfers_aborted():number { return this.stats[49];}
    get server_transfers_aborted(): number { return this.stats[50]; }
    get last_session():number { return this.stats[55];}
    get last_health_check():number { return this.stats[56];}
    get last_agent_check():number { return this.stats[57];}
    get average_queue_time():number { return this.stats[58];}
    get average_connect_time():number { return this.stats[59];}
    get average_response_time():number { return this.stats[60];}
    get average_total_session_time():number { return this.stats[61];}
    get agent_status(): string { return this.stats[62]; }
    get agent_code():number { return this.stats[63];}
    get agent_duration():number { return this.stats[64];}
    get check_description():string { return this.stats[65];}
    get agent_description():string { return this.stats[66];}
    get check_rise():number { return this.stats[67];}
    get check_fall():number { return this.stats[68];}
    get check_health():number { return this.stats[69];}
    get agent_rise():number { return this.stats[70];}
    get agent_fall():number { return this.stats[71];}
    get agent_health():number { return this.stats[72];}
    get address():string { return this.stats[73];}
    get cookie(): string { return this.stats[74]; }
    
    get full_server_name(): string { return `${this.proxy_name}/${this.service_name}`; }

    get has_pending_weight_change(): boolean {
        return Server.pendingOps.weight[this.full_server_name] > 0;
    }
    
    get has_pending_status_change(): boolean {
        return Server.pendingOps.status[this.full_server_name] > 0;
    }

    async SetStatus(status: string): Promise<void>{
        let name = this.full_server_name;
        try {
            status = ["maint", "drain", "ready"]
                .find(k => status.trim().toLowerCase() == k);
            if (status) {
                Server.pendingOps.status[name] |= 0;
                Server.pendingOps.status[name]++;
                await this.haproxyInstance.SendCommand(`set server ${name} state ${status}`);
            }    
        } catch{
            throw new Error("Unable to set the status for the server at this time, please try again later.");
        } finally {
            Server.pendingOps.status[name]--;
        }
    }

    async SetWeight(weight: number): Promise<void> {
        let name = this.full_server_name;
        try {
            if (weight >= 0 && weight <= 256) {
                Server.pendingOps.weight[name] |= 0;
                Server.pendingOps.weight[name]++;
                await this.haproxyInstance.SendCommand(`set server ${name} weight ${weight}`);
            }
        } catch{
            throw new Error("Unable to set the weight for the server at this time, please try again later.");
        } finally {
            Server.pendingOps.weight[name]--;
        }
    };

    private static pendingOps = { status: {}, weight : { }}
}
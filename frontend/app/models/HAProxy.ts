import Axios, { AxiosResponse, AxiosRequestConfig, AxiosBasicCredentials } from 'axios';
import * as papaparse from 'papaparse';
import Store from './Store';
import { groupBy } from './Helpers';

export interface ConnectionSettings extends AxiosBasicCredentials {
    url: string
    timeout: number
    display_name: string
}

export class HAProxyInstance {
    private config: AxiosRequestConfig;
    settings: ConnectionSettings
    display_name: string
    is_available = false;
    has_loaded = false;
    
    get key():string {
        return `${this.display_name}~${this.settings.url}`
    }

    proxies: Proxy[] = [];

    constructor(settings: ConnectionSettings) {
        this.settings = settings;
        this.config = <AxiosRequestConfig> {
            baseURL: settings.url,
            timeout: (settings.timeout || 10) * 1000
        }

        if (settings.username && settings.password) {
            this.config.auth = this.settings;   
        }
        this.display_name = settings.display_name || settings.url;

        setInterval(async () => {
            await this.Proxies();
        }, 10000)
        this.Proxies();
    }

    async SendCommand(path, payload): Promise<any>{
        try {
            let results = await <Promise<AxiosResponse<any>>>Axios.post(path, payload, this.config);
            this.is_available = true;
            return results.data;
        } catch(err){
            this.is_available = false;
            throw err;
        }    
    }

    async Query(path): Promise<any>{
        try {
            let results = await <Promise<AxiosResponse<any>>>Axios.get(path, this.config);
            this.is_available = true;
            return results.data;
        } catch (err) {
            this.is_available = false;
            throw err;
        }    
    }

    async Proxies(): Promise<Proxy[]> {
        try {
            let responses = await this.Query('stats');
            this.proxies = responses.proxies.map(k => new Proxy(this, k));
            this.has_loaded = true;
            Store.instance.TriggerUpdate();
            return this.proxies;
        }
        catch (err) {
            throw err;
            //throw new Error("Unable to retrieve server info at this time.");
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

    protected stats: any;
    get haproxyInstance() { return this.proxy.haproxyInstance; }
    proxy: Proxy;

    get key() { return `${this.proxy.key}/${this.service_id}`; }

    constructor(proxy: Proxy, stats:any) {
        this.proxy = proxy;
        this.stats = stats;
    }

    UpdateData(stats: any) {
        this.stats = stats;
    }

    get component_type() { return ProxyComponentType.unknown; }
    get proxy_name(): string { return this.stats.pxname; }
    get service_name(): string { return this.stats.svname; }
    get current_sessions(): number { return this.stats.scur; }
    get max_sessions():number { return this.stats.smax;}
    get configured_session_limit():number { return this.stats.slim;}
    get total_sessions():number { return this.stats.stot;}
    get bytes_in():number { return this.stats.bin;}
    get bytes_out():number { return this.stats.bout;}
    get denied_responses():number { return this.stats.dresp;}
    get connection_errors():number { return this.stats.econ;}
    get status():string { return this.stats.status;} // should use an enum -- probably.
    get process_id():string { return this.stats.pid;}
    get proxy_id(): string { return this.stats.iid; }
    get service_id(): string { return this.stats.sid; }
    get type():number { return this.stats.type;}
    get rate():number { return this.stats.rate;}
    get rate_max():number { return this.stats.rate_max;}
    get http_responses_1xx():number { return this.stats.hrsp_1xx;}
    get http_responses_2xx():number { return this.stats.hrsp_2xx;}
    get http_responses_3xx():number { return this.stats.hrsp_3xx;}
    get http_responses_4xx():number { return this.stats.hrsp_4xx;}
    get http_responses_5xx():number { return this.stats.hrsp_5xx;}
    get http_responses_other():number { return this.stats.hrsp_other;}
    get mode():string { return this.stats.mode; }
}

export class Proxy {
    private stats:any;
    private _servers: Server[] = [];
    
    haproxyInstance: HAProxyInstance;

    get name(): string { return this.stats.pxname; }
    get proxy_id() { return this.stats.iid; }

    get servers(): Server[]{
        return this._servers;
    }
    get key(): string {
        return `${this.haproxyInstance.key}/${this.proxy_id}`;
    }

    constructor(haproxy: HAProxyInstance, apiData:any) {
        this.haproxyInstance = haproxy;
        this.stats = apiData.stats;
        this._servers = apiData.servers.map(k => new Server(this, k));
        //Either of these could be null, but that's OK.
    }

    UpdateData(apiData: any) {
        this.stats = apiData.stats;
        //update servers with new data -- this is ham-fisted,
        // a good version of this would merge the data into existing servers,
        // removing old ones.
        this._servers = apiData.servers.map(k => new Server(this, k));
    }
}

export class Frontend extends ProxyComponent {
    
    get component_type() { return ProxyComponentType.frontend; }
    get denied_requests(): number { return this.stats.dreq; }
    get request_errors(): number { return this.stats.ereq; }
    get rate_limit(): number { return this.stats.rate_lim; }
    get request_rate():number { return this.stats.req_rate;}
    get request_rate_max():number { return this.stats.req_rate_max;}
    get request_total(): number { return this.stats.req_tot; }
    get compressor_bytes_in():number { return this.stats.comp_in;}
    get compressor_bytes_out():number { return this.stats.comp_out;}
    get compressor_bytes_bypassed():number { return this.stats.comp_byp;}
    get compressed_response_count():number { return this.stats.comp_rsp;}
    get connection_rate():number { return this.stats.conn_rate;}
    get connection_rate_max():number { return this.stats.conn_rate_max;}
    get connection_total(): number { return this.stats.conn_tot; }
    get intercepted_requests():number { return this.stats.intercepted;}
    get denied_tcp_connections():number { return this.stats.dcon;}
    get denied_tcp_sessions():number { return this.stats.dses;}
}

export class Backend extends ProxyComponent {
    get component_type() { return ProxyComponentType.backend; }
    get current_queued_requests():number { return this.stats.qcur;}
    get queued_requests_max(): number { return this.stats.qmax; }
    get denied_requests(): number { return this.stats.dreq; }
    get response_errors(): number { return this.stats.ereq; }
    get connection_retry_count():number { return this.stats.wretr;}
    get request_redispatch_count(): number { return this.stats.wredis; }
    get total_weight():number { return this.stats.weight;}
    get active_servers():number { return this.stats.act;}
    get backup_servers():number { return this.stats.bck;}
    get health_check_transitions():number { return this.stats.chkdown;}
    get last_status_change():number { return this.stats.lastchg;}
    get downtime(): number { return this.stats.downtime; }
    get load_balance_total():number { return this.stats.lbtot;}
    get request_total(): number { return this.stats.req_tot; }
    get client_transfers_aborted():number { return this.stats.cli_abrt;}
    get server_transfers_aborted(): number { return this.stats.srv_abrt; }
    get compressor_bytes_in():number { return this.stats.comp_in;}
    get compressor_bytes_out():number { return this.stats.comp_out;}
    get compressor_bytes_bypassed():number { return this.stats.comp_byp;}
    get compressed_response_count(): number { return this.stats.comp_rsp; }
    get last_session():number { return this.stats.lastsess;}
    get average_queue_time():number { return this.stats.qtime;}
    get average_connect_time():number { return this.stats.ctime;}
    get average_response_time():number { return this.stats.rtime;}
    get average_total_session_time():number { return this.stats.ttime;}
    get cookie(): string { return this.stats.cookie; }
    get load_balancing_algorithm():string { return this.stats.algo;}
    get intercepted_requests():number { return this.stats.intercepted;}
}

export class Server extends ProxyComponent{
    get component_type() { return ProxyComponentType.server; }
    get current_queued_requests():number { return this.stats.qcur;}
    get queued_requests_max(): number { return this.stats.qmax; }
    get response_errors(): number { return this.stats.eresp; }
    get connection_retry_count():number { return this.stats.wretr;}
    get request_redispatch_count():number { return this.stats.wredis;}
    get weight():number { return this.stats.weight;}
    get is_active():boolean { return this.stats.act;}
    get is_backup():boolean { return this.stats.bck;}
    get failed_checks():number { return this.stats.chkfail;}
    get health_check_transitions():number { return this.stats.chkdown;}
    get last_status_change():number { return this.stats.lastchg;}
    get downtime():number { return this.stats.downtime;}
    get max_queue_per_server(): number { return this.stats.qlimit; }
    get server_id():string { return this.stats.sid;}
    get throttle():number { return this.stats.throttle;}
    get load_balance_total():number { return this.stats.lbtot;}
    get tracked(): string { return this.stats.tracked; }
    get check_status(): string { return this.stats.check_status; }
    get check_code():number { return this.stats.check_code;}
    get check_duration(): number { return this.stats.check_duration; }
    get failed_health_check_details(): string { return this.stats.hanafail; }
    get client_transfers_aborted():number { return this.stats.cli_abrt;}
    get server_transfers_aborted(): number { return this.stats.srv_abrt; }
    get last_session():number { return this.stats.lastsess;}
    get last_health_check():number { return this.stats.last_chk;}
    get last_agent_check():number { return this.stats.last_agt;}
    get average_queue_time():number { return this.stats.qtime;}
    get average_connect_time():number { return this.stats.ctime;}
    get average_response_time():number { return this.stats.rtime;}
    get average_total_session_time():number { return this.stats.ttime;}
    get agent_status(): string { return this.stats.agent_status; }
    get agent_code():number { return this.stats.agent_code;}
    get agent_duration():number { return this.stats.agent_duration;}
    get check_description():string { return this.stats.check_desc;}
    get agent_description():string { return this.stats.agent_desc;}
    get check_rise():number { return this.stats.check_rise;}
    get check_fall():number { return this.stats.check_fall;}
    get check_health():number { return this.stats.check_health;}
    get agent_rise():number { return this.stats.agent_rise;}
    get agent_fall():number { return this.stats.agent_fall;}
    get agent_health():number { return this.stats.agent_health;}
    get address():string { return this.stats.addr;}
    get cookie(): string { return this.stats.cookie; }
    
    private get server_identifier(): string { return `${this.proxy_id}/${this.service_id}`; }

    get has_pending_weight_change(): boolean {
        return Server.pendingOps.weight[this.server_identifier] > 0;
    }
    
    get has_pending_status_change(): boolean {
        return Server.pendingOps.status[this.server_identifier] > 0;
    }

    async SetStatus(status: string): Promise<void>{
        let name = this.server_identifier;
        try {
            status = ["maint", "drain", "ready"]
                .find(k => status.trim().toLowerCase() == k);
            if (status) {
                Server.pendingOps.status[name] |= 0;
                Server.pendingOps.status[name]++;
                await this.haproxyInstance.SendCommand('server/set-mode',{
                    iid: this.proxy_id,
                    sid: this.server_id,
                    mode: status
                });
                Store.instance.TriggerUpdate();
            } 
        } catch{
            throw new Error("Unable to set the status for the server at this time, please try again later.");
        } finally {
            Server.pendingOps.status[name]--;
        }
    }

    async SetWeight(weight: number): Promise<void> {
        let name = this.server_identifier;
        try {
            if (weight >= 0 && weight <= 256) {
                Server.pendingOps.weight[name] |= 0;
                Server.pendingOps.weight[name]++;
                await this.haproxyInstance.SendCommand('server/set-weight', {
                    iid: this.proxy_id,
                    sid: this.server_id,
                    weight: weight
                });
                Store.instance.TriggerUpdate();
            }
        } catch{
            throw new Error("Unable to set the weight for the server at this time, please try again later.");
        } finally {
            Server.pendingOps.weight[name]--;
        }
    };

    private static pendingOps = { status: {}, weight : { }}
}
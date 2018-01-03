import Axios, { AxiosResponse, AxiosRequestConfig, AxiosBasicCredentials } from 'axios';

export default class Server {
    private config: AxiosRequestConfig;
    display_name: string
    
    constructor(url: string, username: string, password: string, timeout:number = 10, display_name:string = null) {
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
    }

    async Frontends(): Promise<Frontend[]> {
        try {
            let results = await <Promise<AxiosResponse<string>>>Axios.post('manage', "show stat", this.config);
            let responseLines = results.data.split(/[\r\n]+/g).filter(s=> s.length > 0)
            let header = responseLines.shift();

            let frontends: Frontend[] = [];
            var buffer: string[] = [];

            while (responseLines.length > 0) {
                var line = responseLines.shift();
                if (/^[^,]+,FRONTEND,/.test(line)) {
                    if (buffer.length > 0) {
                        frontends.push(new Frontend(this, buffer, header));
                        buffer = [];
                    }
                }
                buffer.push(line)
            }
            
            if (buffer.length > 0) {
                frontends.push(new Frontend(this, buffer, header));
                buffer = [];
            }
            
            return frontends;
        }
        catch (err) {
            throw new Error("Unable to retrieve server info at this time.");
        }
    }
}

class Frontend {
    private data: string;
    private header: string;
    private parsed_backends:Backend[] = []
    name: string
    server: Server;
    
    get backends(): Backend[] {
        return this.parsed_backends;
    }

    constructor(server: Server, data: string[], header: string) {
        this.server = server;
        //the first line of the stats is the data for the frontend is for 
        this.data = data.shift();
        this.parsed_backends = data.map(f=> new Backend(this, f, header));
        this.name = this.data.split(',')[0];
        this.header = header;
    }
}

/* There's still one more layer of stats that should be generated: 'BackendServer' -- will get to that next. */
class Backend{
    private data: string;
    private header: string;
    frontend: Frontend;
    name: string;

    constructor(frontend:Frontend, data: string, header: string) {
        this.frontend = frontend;
        this.data = data;
        this.name = data.split(',')[0];
    }
}
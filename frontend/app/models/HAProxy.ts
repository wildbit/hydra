import Axios, { AxiosResponse, AxiosRequestConfig, AxiosBasicCredentials } from 'axios';
import * as papaparse from 'papaparse';

export class HAProxyInstance {
    private config: AxiosRequestConfig;
    display_name: string
    
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
    }

    async Proxies(): Promise<any[]> {
        try {
            let results = await <Promise<AxiosResponse<string>>>Axios.post('manage', "show stat", this.config);
            let responseLines = papaparse.parse(results.data, {comments: "#", dynamicTyping: true, skipEmptyLines: true}).data;
            return responseLines;
        }
        catch (err) {
            throw new Error("Unable to retrieve server info at this time.");
        }
    }
}

export class Proxy {
    name: string;
    backend: Backend
    Frontend: Frontend
    get servers(): Server[]{
        return []
    }

    constructor(haproxy: HAProxyInstance, proxyElements: string[]) {
        
    }
}

export class Frontend {
    name: string
    constructor(proxy: Proxy, data: string) {

    }
}

export class Backend {

}

export class Server{
    private data: string;
    private header: string;
    name: string;

    constructor(proxy:Proxy, data: string) {
        this.data = data;
        this.name = data.split(',')[0];
    }
}
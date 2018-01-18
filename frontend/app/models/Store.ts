import { HAProxyInstance, ConnectionSettings } from './HAProxy';

type ModelUpdateCallback = (instances: HAProxyInstance[]) => void;
interface CallbackHandle<T> { handle: any, callback: T };

export default class Store{
    static INSTANCES_KEY = "haproxy-instances-settings";
    static instance = new Store()

    // This is an in memory listing, connection 
    // info should be kept in localstorage for a real case.
    private instances: HAProxyInstance[] = [];
    private callbacks: CallbackHandle<ModelUpdateCallback>[] = [];

    constructor() {
        let connectionData = localStorage.getItem(Store.INSTANCES_KEY) || "[]"
        let connections = <ConnectionSettings[]>JSON.parse(connectionData); 
        this.instances = connections.map(k => new HAProxyInstance(k));
    }

    public List(): HAProxyInstance[] {
        return this.instances;
    }

    public Add(url: string, display_name: string = null,
        username: string = null, password: string = null, timeout: number = 5): HAProxyInstance {
        let newInstance = new HAProxyInstance({
            url: url.replace(/(\\|\/)+$/,''),
            username,
            password,
            timeout,
            display_name
        });
        this.instances.push(newInstance);
        this.SaveInstances()
        return newInstance;
    }

    public Update(instance: HAProxyInstance, url: string, display_name: string = null,
        username: string = null, password: string = null, timeout:number = 5): HAProxyInstance {
        let index = this.instances.indexOf(instance);
        let newInstance = new HAProxyInstance({
            url: url.replace(/(\\|\/)+$/, ''),
            username, password,
            timeout, display_name
        });

        this.instances.splice(index, 1, newInstance);
        this.SaveInstances()
        return newInstance;
    }

    public Remove(instance: HAProxyInstance) {
        this.instances = this.instances.filter(f => f != instance);
        this.SaveInstances();
    }

    private SaveInstances() {
        var all_settings = this.instances.map(k => k.settings);
        localStorage.setItem(Store.INSTANCES_KEY, JSON.stringify(all_settings));
        this.TriggerUpdate();
    }

    public RegisterListener(handle:any, callback: ModelUpdateCallback) {
        this.callbacks.push({ handle, callback });
        callback(this.instances);
    }
    
    public UnregisterListener(handle: any) {
        this.callbacks = this.callbacks.filter(f => f.handle != handle);
    }

    public TriggerUpdate() {
        this.callbacks.forEach(f => f.callback(this.instances));
    }
}

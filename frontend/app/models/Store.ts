import { HAProxyInstance } from './HAProxy';

type ModelUpdateCallback = (instances: HAProxyInstance[]) => void;

export default class Store{

    static instance = new Store()

    // This is an in memory listing, connection 
    // info should be kept in localstorage for a real case.
    private instances: HAProxyInstance[] = [];
    private callbacks: ModelUpdateCallback[] = [];

    public List(): HAProxyInstance[] {
        return this.instances;
    }

    public Add(url: string, display_name: string = null,
        username: string = null, password: string = null, timeout:number = 5): HAProxyInstance {
        let newInstance = new HAProxyInstance(url, username, password, timeout, display_name);
        this.instances.push(newInstance);
        return newInstance;
    }

    public Remove(instance: HAProxyInstance) {
        this.instances = this.instances.filter(f => f != instance);
    }

    public RegisterListener(callback: ModelUpdateCallback) {
        this.callbacks.push(callback);
    }

    public TriggerUpdate() {
        this.callbacks.forEach(f => f(this.instances));
    }
}
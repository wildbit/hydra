
export default class Server {
    private url: string = null;
    private username: string = null;
    private password: string = null;

    constructor(url: string, username: string, password: string) {

    }

    async Frontends(): Promise<boolean> {
        return false;
    }

    Save() {
        //add to local storage.
    }

    Remove() {
        //remove from local storage.
    }
}
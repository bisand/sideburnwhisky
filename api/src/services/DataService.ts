import Nano, { DatabaseAuthResponse, DatabaseCreateResponse, ServerScope } from "nano";
import { IDataService } from './IDataService';

export class DataService implements IDataService {
    protected nano!: ServerScope;
    protected db: any;

    constructor() {
        this.init();
    }
    async init() {
        this.nano = Nano('http://' + process.env.COUCHDB_HOST + ':' + process.env.COUCHDB_PORT) as ServerScope;
        const response: DatabaseAuthResponse = await this.nano.auth(process.env.COUCHDB_USER as string, process.env.COUCHDB_PASSWORD as string);
        if (!response.ok) {
            throw new Error("An error occurred during database authentication.");
        }
        const dblist = await this.nano.db.list();
        if (!dblist || dblist.indexOf('sideburn') === -1) {
            const result: DatabaseCreateResponse = await this.nano.db.create('sideburn');
            if (!result.ok) {
                throw new Error("An error occurred while trying to create database.");
            }
        }
    }
}

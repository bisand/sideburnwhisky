import Nano, { DatabaseAuthResponse, DatabaseCreateResponse, DocumentScope, ServerScope } from "nano";
import { DatabaseConfig } from "./DatabaseConfig";
import { IDataService } from './IDataService';

export class DataService implements IDataService {
    private _config: DatabaseConfig;
    private _nano: ServerScope;
    private _db!: DocumentScope<unknown>;
    public get db(): DocumentScope<unknown> {
        return this._db;
    }

    constructor(config: DatabaseConfig, databaseReadyCallback?: () => void) {
        if (!config.host)
            throw new Error('The required environment variable "COUCHDB_HOST" is missing.');
        if (!config.port)
            throw new Error('The required environment variable "COUCHDB_PORT" is missing.');
        if (!config.user)
            throw new Error('The required environment variable "COUCHDB_USER" is missing.');
        if (!config.password)
            throw new Error('The required environment variable "COUCHDB_PASSWORD" is missing.');
        if (!config.databaseName)
            throw new Error('The required environment variable "COUCHDB_DATABASE" is missing.');
        this._config = config

        this._nano = Nano({
            url: 'http://' + this._config.user + ':' + this._config.password + '@' + this._config.host + ':' + this._config.port,
            requestDefaults: { jar: true }
        }) as ServerScope;
        this.init(databaseReadyCallback);
    }

    private async init(databaseReadyCallback?: () => void) {
        // const response: DatabaseAuthResponse = await this._nano.auth(this._config.user, this._config.password);
        // if (!response.ok) {
        //     throw new Error("An error occurred during database authentication.");
        // }

        const dblist = await this._nano.db.list();
        if (!dblist || dblist.indexOf(this._config.databaseName) === -1) {
            const result: DatabaseCreateResponse = await this._nano.db.create(this._config.databaseName);
            if (!result.ok) {
                throw new Error("An error occurred while trying to create database.");
            }
        }

        this._db = this._nano.db.use(this._config.databaseName);
        if (databaseReadyCallback)
            databaseReadyCallback();
    }
}

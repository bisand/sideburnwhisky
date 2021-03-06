import Nano, { DatabaseAuthResponse, DatabaseSessionResponse, DatabaseCreateResponse, DocumentScope, ServerScope } from "nano";
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

        const url = 'http://' + this._config.host + ':' + this._config.port;
        this._nano = Nano({
            url: url,
            requestDefaults: { jar: true }
        }) as ServerScope;
        this.init(databaseReadyCallback);
    }

    public async auth(): Promise<Boolean> {
        try {
            const response: DatabaseAuthResponse = await this._nano.auth(this._config.user, this._config.password);
            if (response.ok) {
                return true;
            }
        } catch (error: any) {
            console.error(error);
        }
        return false;
    }

    private async session(): Promise<void> {
        try {
            const res: DatabaseSessionResponse = await this._nano.session();
            if (res.userCtx?.name !== 'admin')
                await this.auth();
        } catch (error: any) {
            console.error(error);
        }
    }

    private startScheduler() {
        try {
            var minutes = 5, the_interval = minutes * 60 * 1000;
            var self = this;
            setInterval(async function () {
                try {
                    console.log("Running scheduled tasks...");
                    await self.auth();
                    console.log("Scheduled tasks done.");
                } catch (error) {
                    console.error(`An error ocurred while running scheduled tasks: ${error}`);
                }
            }, the_interval);
        } catch (error: any) {
            console.error(error)
        }
    }

    private async init(databaseReadyCallback?: () => void) {

        console.log('Starting database init...')
        await this.auth();
        this.startScheduler();

        try {
            const dblist = await this._nano.db.list();
            if (!dblist || dblist.indexOf(this._config.databaseName) === -1) {
                console.log(`Database "${this._config.databaseName}" does not exists. Creating...`)
                const result: DatabaseCreateResponse = await this._nano.db.create(this._config.databaseName);
                if (!result.ok) {
                    throw new Error("An error occurred while trying to create database.");
                }
            } else {
                console.log(`Database "${this._config.databaseName}" allready exists.`)
            }
        } catch (error: any) {
            console.error(error);
            if (error?.statusCode === 401) {
                await this.auth();
                await this.init(databaseReadyCallback)
            }
        }

        this._db = this._nano.db.use(this._config.databaseName);
        if (databaseReadyCallback)
            databaseReadyCallback();
        console.log('Database init complete.');
    }
}

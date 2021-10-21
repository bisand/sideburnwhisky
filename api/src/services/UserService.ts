import nano from 'nano';
import { User } from '../models/User';
import { HttpError } from '../models/HttpError';
import { IDataService } from './IDataService';
import { DocumentService } from './DocumentService';

export class UserService extends DocumentService {
    public async saveUser(user: User): Promise<string> {
        try {
            const response = await this._dataService.db.insert(user);
            if (response.ok)
                return response.id;
        } catch (error: any) {
            throw new HttpError(error.statusCode, error.message);
        }
        return '';
    }

    public async getUsers(): Promise<User[]> {
        try {
            const response = await this._dataService.db.view(this._designName, "all", { include_docs: true });
            const result: User[] = [];
            response.rows.forEach(doc => {
                result.push(Object.assign({} as User, doc));
            });
            return result;
        } catch (error) {
            console.error(error);
        }
        return [];
    }

    public async getActiveUsers(): Promise<User[]> {
        try {
            const response = await this._dataService.db.view(this._designName, "active", { include_docs: true });
            const result: User[] = [];
            response.rows.forEach(doc => {
                result.push(Object.assign({} as User, doc));
            });
            return result;
        } catch (error) {
            console.error(error);
        }
        return [];
    }

    private _designName: string = 'sideburn-users';

    constructor(dataService: IDataService) {
        super(dataService);
        this.createViews();
    }

    // Remember to change version number in the design document when changing views.
    private createViews() {
        const allUsers = `function (doc) {
            if (doc.type === "user") { 
                emit(doc.username, doc.firstName + ' ' + doc.lastName)
            }
        }`;
        const activeUsers = `function (doc) {
            if (doc.type === "user" && doc.active) { 
                emit(doc.username, doc.firstName + ' ' + doc.lastName)
            }
        }`;

        // Design Document
        const ddoc: any = {

            _id: '_design/' + this._designName,
            version: '1',
            views: {
                'active': {
                    map: activeUsers
                },
                'all': {
                    map: allUsers
                },
            },
            options: {
            }
        }

        // create design document
        this.createDesignDocument('_design/' + this._designName, ddoc);
    }
}
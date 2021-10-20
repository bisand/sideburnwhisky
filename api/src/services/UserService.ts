import { User } from '../models/User';
import { IDataService } from './IDataService';

export class UserService {
    async getUsers(): Promise<User[]> {
        try {
            const response = await this._dataService.db.view("sideburn-users", "all");
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

    async getActiveUsers(): Promise<User[]> {
        try {
            const response = await this._dataService.db.view("sideburn-users", "active");
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

    private _dataService: IDataService;
    async createUser(user: User): Promise<string> {
        try {
            const response = await this._dataService.db.insert(user);
            if (response.ok)
                return response.id;
        } catch (error) {
            console.error(error);
        }
        return "";
    }
    constructor(dataService: IDataService) {
        this._dataService = dataService;
        this.createViews();
    }

    private async createViews() {
        // function (doc) { 
        //     if (doc.type === "user" && doc.active) { 
        //       emit(doc.username, doc)
        //     }
        //   }
        // Use this view to retrieve acti ve Users
        const allUsers = `function (doc) {
            if (doc.type === "user") { 
                emit(doc.username, doc)
            }
        }`;
        const activeUsers = `function (doc) {
            if (doc.type === "user" && doc.active) { 
                emit(doc.username, doc)
            }
        }`;

        // Design Document
        const ddoc = {
            _id: '_design/sideburn-users',
            views: {
                'active': {
                    map: activeUsers,
                    // reduce: '_sum'
                },
                'all': {
                    map: allUsers,
                    // reduce: '_sum'
                },
            },
            options: {
                // partitioned: true
            }
        }

        // create design document
        await this._dataService.db.insert(ddoc);
    }
}
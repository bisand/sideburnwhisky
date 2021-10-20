import { User } from '../models/User';
import { IDataService } from './IDataService';

export class UserService {
    async getUsers(): Promise<User[]> {
        try {
            const response = await this._dataService.db.view("sideburn", "users-all");
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
            const response = await this._dataService.db.view("sideburn", "users-active");
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
    }
}
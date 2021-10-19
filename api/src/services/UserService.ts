import { User } from '../models/user';
import { IDataService } from './IDataService';

export class UserService {
    async getUsers(): Promise<User[]> {
        try {
            const response = await this._dataService.db.list();
            const result: User[] = [];
            response.rows.forEach(doc => {
                result.push(new User(doc));
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
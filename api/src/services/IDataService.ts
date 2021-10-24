import { DocumentScope } from "nano";

export interface IDataService {
    auth(): Promise<Boolean>;
    get db(): DocumentScope<unknown>
}
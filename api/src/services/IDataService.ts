import { DocumentScope } from "nano";

export interface IDataService {
    get db(): DocumentScope<unknown>
}
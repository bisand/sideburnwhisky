import { DocumentScope } from "nano";

export interface IDataService {
    auth(): void;
    get db(): DocumentScope<unknown>
}
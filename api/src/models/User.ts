import { BaseDocument } from "./BaseDocument";
import { Role } from "./Role";

export class User extends BaseDocument {
    public username?: string;
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public created?: Date;
    public lastLogin?: Date;
    public active?: Boolean;
    public roles?: Role[];
    constructor() {
        super('user');
    }
}

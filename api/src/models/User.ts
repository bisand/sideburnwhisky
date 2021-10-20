import * as Nano from 'nano';
import { Role } from "./Role";

export class User implements Nano.Document {
    public _id!: string;
    public _rev!: string;
    public type: string;
    public username?: string;
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public created?: Date;
    public lastLogin?: Date;
    public active?: Boolean;
    public roles?: Role[];
    constructor() {
        this.type = 'user';
    }
}

import * as Nano from 'nano';
import { Role } from "./Role";

export interface User extends Nano.MaybeDocument {
    type: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    created: Date;
    lastLogin?: Date,
    active: Boolean;
    roles: Role[];
}

import * as Nano  from 'nano';
import { Role } from "./Role";

export interface User extends Nano.MaybeDocument {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
}

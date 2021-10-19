import { MaybeDocument } from "nano";

export class User implements iUser {
    constructor(user?: any) {
        if(user){
            this._id = user._id;
            this._rev = user._rev;
            this.userName = user.userName;
        }
    }
    userName!: string;
    _id?: string | undefined;
    _rev?: string | undefined;
}
interface iUser extends MaybeDocument {
    userName: string;
}
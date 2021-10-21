import * as Nano from 'nano';

export class BaseDocument implements Nano.Document{
    public _id!: string;
    public _rev!: string;
    public type!: string;
    constructor(docType: string){
        this.type = docType;
    }
}
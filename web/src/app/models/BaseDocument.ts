export class BaseDocument {
    public _id!: string;
    public _rev!: string;
    public type!: string;
    constructor(docType: string) {
        this.type = docType;
    }
}
import { BaseDocument } from "./BaseDocument";

export class Whisky extends BaseDocument {
    public dateCreated: Date;
    public dateModified: Date;
    public name?: string;
    public abv?: string;
    public producer?: string;
    public country?: string;
    public packaging?: string;
    public cork?: string;
    public smell?: string;
    public taste?: string;
    public age?: number;
    public destilled?: Date;
    public tapped?: Date;

    constructor() {
        super('whisky');
        this.dateCreated = new Date();
        this.dateModified = this.dateCreated;
    }
}

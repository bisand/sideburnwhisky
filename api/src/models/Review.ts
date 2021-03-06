import { BaseDocument } from "./BaseDocument";

export class Review extends BaseDocument {
    public dateCreated: Date;
    public dateModified: Date;
    public datePublished?: Date;
    public publishDate?: Date; // Date in for the article to be published.
    public title?: string;
    public subject?: string;
    public body?: string;
    public author: string;
    public tags?: string[];
    public image?: string;
    public whisky!: string;
    public points?: number;

    constructor(author: string) {
        super('review');
        this.author = author
        this.dateCreated = new Date();
        this.dateModified = this.dateCreated;
    }
}
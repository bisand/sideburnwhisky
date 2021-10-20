import * as Nano from 'nano';

export class Article implements Nano.Document {
    _id!: string;
    _rev!: string;
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

    constructor(author: string){
        this.author = author
        this.dateCreated = new Date();
        this.dateModified = this.dateCreated;
    }
}
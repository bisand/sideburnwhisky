import { BaseDocument } from './BaseDocument';
import { IArticle } from './IArticle';

export class Article extends BaseDocument implements IArticle {
    public dateCreated: Date;
    public dateModified: Date;
    public datePublished!: Date;
    public publishDate!: Date; // Date in for the article to be published.
    public title!: string;
    public subject!: string;
    public body!: string;
    public author: string;
    public tags!: string[];
    public image!: string;

    constructor(author: string) {
        super('article');
        this.author = author
        this.dateCreated = new Date();
        this.dateModified = this.dateCreated;
    }
}
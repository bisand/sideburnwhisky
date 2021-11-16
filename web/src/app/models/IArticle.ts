export interface IArticle {
    dateCreated: Date;
    dateModified: Date;
    datePublished: Date;
    publishDate: Date; // Date in for the article to be published.
    title: string;
    subject: string;
    body: string;
    author: string;
    tags: string[];
    image: string;
    active: boolean;
    published: boolean;
}

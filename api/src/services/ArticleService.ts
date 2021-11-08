import { DocumentViewParams } from 'nano';
import { Article } from "../models/Article";
import { HttpError } from "../models/HttpError";
import { DocumentService } from "./DocumentService";
import { IDataService } from "./IDataService";

export class ArticleService extends DocumentService {
    public async addDemoArticle() {
        try {
            var data = new Article('andre@biseth.net');
            data.title = this.getLoremIpsum().generateSentences(1);
            data.subject = this.getLoremIpsum().generateSentences(4);
            data.body = this.getLoremIpsum().generateParagraphs(7);
            data._id = this.generateTextId(data.title);
            const response = await this._dataService.db.insert(data);
            if (response.ok)
                return response.id;
        } catch (error: any) {
            if (error?.statusCode === 401) {
                await this._dataService.auth();
                await this.addDemoArticle();
            } else
                throw new HttpError(error.statusCode, error.message);
        }
        return '';
    }

    public saveArticle(user: Article): Promise<Number> {
        throw new Error('Method not implemented.');
    }

    public async getArticles(viewName: string, key?: string): Promise<Article[]> {
        try {
            const params: DocumentViewParams = {
                include_docs: true,
                key: key
            };
            const response = await this._dataService.db.view(this._designName, viewName, params);
            const result: Article[] = [];
            response.rows.forEach(doc => {
                result.push(Object.assign({} as Article, doc));
            });
            return result;
        } catch (error: any) {
            console.error(error);
            if (error?.statusCode === 401) {
                await this._dataService.auth();
                return await this.getArticles(viewName);
            }
        }
        return [];
    }

    private _designName: string = 'sideburn-articles';

    constructor(dataService: IDataService) {
        super(dataService);
        this.createViews();
    }

    // Remember to change version number in the design document when changing views.
    private createViews() {
        const allArticles = `function (doc) {
            if (doc.type === "article") { 
                emit(doc.author, doc.title)
            }
        }`;
        const activeArticles = `function (doc) {
            if (doc.type === "article" && doc.active) { 
                emit(doc.author, doc.title)
            }
        }`;
        const unpublishedArticles = `function (doc) {
            if (doc.type === "article" && !doc.published) { 
                emit(doc.author, doc.title)
            }
        }`;
        const publishedArticles = `function (doc) {
            if (doc.type === "article" && doc.published) { 
                emit(doc.author, doc.title)
            }
        }`;

        // Design Document
        const ddoc: any = {

            _id: '_design/' + this._designName,
            version: '7',
            views: {
                'active': {
                    map: activeArticles
                },
                'unpublished': {
                    map: unpublishedArticles
                },
                'published': {
                    map: publishedArticles
                },
                'all': {
                    map: allArticles
                },
            },
            options: {
            }
        }

        // create design document
        this.createDesignDocument('_design/' + this._designName, ddoc);
    }

}
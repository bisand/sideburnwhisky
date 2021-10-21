import { Article } from "../models/Article";
import { HttpError } from "../models/HttpError";
import { DocumentService } from "./DocumentService";
import { IDataService } from "./IDataService";
import { LoremIpsum } from "lorem-ipsum";

export class ArticleService extends DocumentService {
    private getLoremIpsum(){
        const lorem = new LoremIpsum({
            sentencesPerParagraph: {
              max: 8,
              min: 4
            },
            wordsPerSentence: {
              max: 16,
              min: 4
            }
          });
          return lorem;
    }
    public async addDemoArticles() {
        try {
            var data = new Article('andre@biseth.net');
            data.title = this.getLoremIpsum().generateWords(4);
            data.subject = this.getLoremIpsum().generateSentences(2);
            data.body = this.getLoremIpsum().generateParagraphs(7);
            const response = await this._dataService.db.insert(data);
            if (response.ok)
                return response.id;
        } catch (error: any) {
            throw new HttpError(error.statusCode, error.message);
        }
        return '';
    }

    public async getArticles(): Promise<Article[]> {
        try {
            const response = await this._dataService.db.view(this._designName, "all", { include_docs: true });
            const result: Article[] = [];
            response.rows.forEach(doc => {
                result.push(Object.assign({} as Article, doc));
            });
            return result;
        } catch (error) {
            console.error(error);
        }
        return [];
    }

    private _designName: string = 'sideburn-articles';

    constructor(dataService: IDataService){
        super(dataService);
        this.createViews();
    }

    // Remember to change version number in the design document when changing views.
    private createViews() {
        const allUsers = `function (doc) {
            if (doc.type === "article") { 
                emit(doc.title, doc.datePublished)
            }
        }`;
        const activeUsers = `function (doc) {
            if (doc.type === "article" && doc.active) { 
                emit(doc.title, doc.datePublished)
            }
        }`;

        // Design Document
        const ddoc: any = {

            _id: '_design/' + this._designName,
            version: '2',
            views: {
                'active': {
                    map: activeUsers
                },
                'all': {
                    map: allUsers
                },
            },
            options: {
            }
        }

        // create design document
        this.createDesignDocument('_design/' + this._designName, ddoc);
    }

}
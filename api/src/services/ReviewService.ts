import { HttpError } from "../models/HttpError";
import { Review } from '../models/Review';
import { DocumentService } from "./DocumentService";
import { IDataService } from "./IDataService";

export class ReviewService extends DocumentService {
    public async addDemoReview() {
        try {
            var data = new Review('andre@biseth.net');
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
                await this.addDemoReview();
            } else
                throw new HttpError(error.statusCode, error.message);
        }
        return '';
    }

    public async getReviews(): Promise<Review[]> {
        try {
            const response = await this._dataService.db.view(this._designName, "all", { include_docs: true });
            const result: Review[] = [];
            response.rows.forEach(doc => {
                result.push(Object.assign({} as Review, doc));
            });
            return result;
        } catch (error: any) {
            console.error(error);
            if (error?.statusCode === 401) {
                await this._dataService.auth();
                return await this.getReviews();
            }
        }
        return [];
    }

    private _designName: string = 'sideburn-reviews';

    constructor(dataService: IDataService) {
        super(dataService);
        this.createViews();
    }

    // Remember to change version number in the design document when changing views.
    private createViews() {
        const allReviews = `function (doc) {
            if (doc.type === "review") { 
                emit(doc.title, doc.datePublished)
            }
        }`;
        const activeReviews = `function (doc) {
            if (doc.type === "review" && doc.active) { 
                emit(doc.title, doc.datePublished)
            }
        }`;

        // Design Document
        const ddoc: any = {

            _id: '_design/' + this._designName,
            version: '2',
            views: {
                'active': {
                    map: activeReviews
                },
                'all': {
                    map: allReviews
                },
            },
            options: {
            }
        }

        // create design document
        this.createDesignDocument('_design/' + this._designName, ddoc);
    }

}
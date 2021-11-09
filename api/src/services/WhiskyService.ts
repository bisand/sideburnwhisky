import { HttpError } from "../models/HttpError";
import { Whisky } from '../models/Whisky';
import { DocumentService } from "./DocumentService";
import { IDataService } from "./IDataService";

export class WhiskyService extends DocumentService {
    public async addDemoWhisky() {
        try {
            var data = new Whisky();
            data.name = this.getLoremIpsum().generateWords(3);
            data.producer = this.getLoremIpsum().generateWords(2);
            data.country = this.getLoremIpsum().generateWords(1);
            data._id = this.generateTextId(data.name);
            const response = await this._dataService.db.insert(data);
            if (response.ok)
                return response.id;
        } catch (error: any) {
            if (error?.statusCode === 401) {
                await this._dataService.auth();
                await this.addDemoWhisky();
            } else
                throw new HttpError(error.statusCode, error.message);
        }
        return '';
    }

    public async getWhiskys(): Promise<Whisky[]> {
        try {
            const response = await this._dataService.db.view(this._designName, "all", { include_docs: true });
            const result: Whisky[] = [];
            response.rows.forEach(doc => {
                result.push(Object.assign({} as Whisky, doc));
            });
            return result;
        } catch (error: any) {
            console.error(error);
            if (error?.statusCode === 401) {
                await this._dataService.auth();
                return await this.getWhiskys();
            }
        }
        return [];
    }

    constructor(dataService: IDataService) {
        super(dataService, 'sideburn-whiskys');
    }

    // Remember to change version number in the design document when changing views.
    protected createViews(designName: string) {
        const allWhiskys = `function (doc) {
            if (doc.type === "whisky") { 
                emit(doc.name, doc.datePublished)
            }
        }`;
        const activeWhiskys = `function (doc) {
            if (doc.type === "whisky" && doc.active) { 
                emit(doc.name, doc.datePublished)
            }
        }`;

        // Design Document
        const ddoc: any = {

            _id: '_design/' + designName,
            version: '2',
            views: {
                'active': {
                    map: activeWhiskys
                },
                'all': {
                    map: allWhiskys
                },
            },
            options: {
            }
        }

        // create design document
        this.createDesignDocument('_design/' + this._designName, ddoc);
    }

}
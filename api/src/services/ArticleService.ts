import { DocumentService } from "./DocumentService";
import { IDataService } from "./IDataService";

export class ArticleService extends DocumentService {
    private _designName: string = 'sideburn-articles';

    constructor(dataService: IDataService){
        super(dataService);
        this.createViews();
    }

    private createViews() {
        const allUsers = `function (doc) {
            if (doc.type === "article") { 
                emit(doc.username, doc.firstName + ' ' + doc.lastName)
            }
        }`;
        const activeUsers = `function (doc) {
            if (doc.type === "article" && doc.active) { 
                emit(doc.username, doc.firstName + ' ' + doc.lastName)
            }
        }`;

        // Design Document
        const ddoc: any = {

            _id: '_design/' + this._designName,
            version: '1',
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
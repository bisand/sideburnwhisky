import { IDataService } from './IDataService';


export abstract class DocumentService {
    protected _dataService: IDataService;
    constructor(dataService: IDataService) {
        this._dataService = dataService;
    }

    protected replaceSpecialChars(s: string): string {
        let translate_re = /[æøåéÆØÅÉ]/g;
        let translate: object = {
            "æ": "a", "ø": "o", "å": "a", "é": "e",
            "Æ": "A", "Ø": "O", "Å": "A", "É": "E"
        };
        const result = s.replace(translate_re, function (match) {
            let i: any = Object.keys(translate).findIndex((val) => {
                return val === match;
            });
            return Object.values(translate)[i];;
        });
        return result;
    }
    protected createDesignDocument(documentName: string, designDocument: any) {
        this._dataService.db.get(documentName, (err, design: any) => {
            if (err)
                return this._dataService.db.insert(designDocument);

            console.log('comparing "' + documentName + '" design version', design.version, designDocument.version);
            if (design.version !== designDocument.version) {
                designDocument._rev = design._rev;
                this._dataService.db.insert(designDocument, (err) => {
                    if (err)
                        return console.log('error updating "' + documentName + '" design', err);
                    console.log('"' + documentName + '" design updated to version', designDocument.version);
                });
            }
        });
    }
}

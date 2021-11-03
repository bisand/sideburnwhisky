import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Article } from '../models/Article'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private _apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this._apiUrl = environment.apiUrl;
  }

  public getArticles(): Observable<any> {
    return this.httpClient.get(this._apiUrl + '/articles/');
  }

  public getUnpublishedArticles(): Observable<any> {
    return this.httpClient.get(this._apiUrl + '/articles/unpublished/');
  }

  public createNewArticle(article: Article): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this._apiUrl}/articles`, article, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

  public uploadImage(file: File): Observable<HttpEvent<any>> {

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);

    // Make http post request over api
    // with formData as req
    // return this.httpClient.post(environment.apiUrl+'/articles/', formData)
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this._apiUrl}/articles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);

  }

}

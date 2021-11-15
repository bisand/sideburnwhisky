import { HttpClient, HttpEvent, HttpHeaderResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Article } from '../models/Article'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private _apiUrl: string;

  constructor(private _httpClient: HttpClient) {
    this._apiUrl = environment.apiUrl;
  }

  public getArticles(): Observable<any> {
    return this._httpClient.get(this._apiUrl + '/articles/');
  }

  public getArticle(id: string): Observable<any> {
    let article = this._httpClient.get(this._apiUrl + '/articles/' + id);
    return article;
  }

  public deleteArticle(id: string): Observable<any> {
    let result = this._httpClient.delete(this._apiUrl + '/articles/' + id);
    return result;
  }

  public getUnpublishedArticles(): Observable<any> {
    let articles = this._httpClient.get(this._apiUrl + '/articles/unpublished/');
    return articles;
  }

  public createNewArticle(article: Article): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this._apiUrl}/articles`, article, {
      reportProgress: true,
      responseType: 'json'
    });
    return this._httpClient.request(req);
  }

  public saveArticle(article: Article) {
    const req = new HttpRequest('PUT', `${this._apiUrl}/articles/${article._id}`, article, {
      reportProgress: true,
      responseType: 'json'
    });
    return this._httpClient.request(req);
  }

  public async publishArticle(article: Article): Promise<any> {
    const result = await this._httpClient.patch(`${this._apiUrl}/articles/${article._id}/publish`, {}).toPromise().then(res=>{
      return res;
    });
    return result;
  }

  public async unpublishArticle(article: Article): Promise<any> {
    const result = await this._httpClient.patch(`${this._apiUrl}/articles/${article._id}/unpublish`, {}).toPromise();
    return result;
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

    return this._httpClient.request(req);

  }

}

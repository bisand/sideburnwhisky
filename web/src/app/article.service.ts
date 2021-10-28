import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';
import { Article } from '../../../api/src/models/Article'

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private httpClient: HttpClient, private http: HttpClient) {
    console.log(environment.apiUrl);
  }

  public getArticles(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + '/articles/');
  }

  public createNewArticle(article: Article): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${environment.apiUrl}/articles`, article, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
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

    const req = new HttpRequest('POST', `${environment.apiUrl}/articles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);

  }

}

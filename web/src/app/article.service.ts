import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private httpClient: HttpClient) {
    console.log(environment.apiUrl);
  }

  public getArticles(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + '/articles/');
  }

  public uploadImage(file: File): Observable<any> {

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.httpClient.post(environment.apiUrl+'/articles/', formData)
  }

}

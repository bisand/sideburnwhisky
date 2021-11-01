import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _apiUrl: string;

  constructor(private httpClient: HttpClient) { 
    this._apiUrl = environment.apiUrl;
  }

  public getPermissions(): Observable<any> {
    return this.httpClient.get(this._apiUrl + '/user/permissions/');
  }

}

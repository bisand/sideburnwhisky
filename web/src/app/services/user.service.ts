import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { 
    console.log(environment.apiUrl);
  }

  public getPermissions(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + '/user/permissions/');
  }

}

import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IdToken, LogoutOptions, User } from '@auth0/auth0-spa-js';
import { Observable, Subscription } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  accessToken?: string;
  claims: IdToken | undefined | null;
  user: User | null | undefined;
  isAuthenticated: boolean = false;
  profile: User | null | undefined;

  logout(options?: LogoutOptions) {
    this._authService.logout(options);
  }
  loginWithRedirect() {
    this._authService.loginWithRedirect();
  }

  constructor(private _authService: AuthService, private _userService: UserService) {
    this._authService.error$.subscribe(error => {
    });
    this._authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    }, error => {
      console.log('Login required.')
    });
    this._authService.user$.subscribe(user => {
      this.profile = user;
      this.user = user;
    }, error => {
      console.log('Login required.')
    });
    this._authService.idTokenClaims$.subscribe((claims) => {
      this.claims = claims;
    }, error => {
      console.log('Login required.')
    });
    this._authService.getAccessTokenSilently({}).subscribe(token => {
      this.accessToken = token;
      console.log(token);
      this._userService.getPermissions().subscribe(permissions => {
        console.log(permissions);
      })
    }, error => {
      console.log('Login required.')
    });
  }
}

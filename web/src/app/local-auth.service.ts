import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IdToken, LogoutOptions, User } from '@auth0/auth0-spa-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  accessToken?: string;
  claims: IdToken | undefined | null;
  logout(options?: LogoutOptions) {
    this.authService.logout(options);
  }
  loginWithRedirect() {
    this.authService.loginWithRedirect();
  }
  isAuthenticated: boolean = false;
  profile: User | null | undefined;

  constructor(private authService: AuthService) {
    this.authService.error$.subscribe(error => {
      // console.error(error);
    });
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.authService.user$.subscribe(user => {
      this.profile = user;
    });
    this.authService.idTokenClaims$.subscribe((claims) => {
      this.claims = claims;
      console.log(claims);
    });
    this.authService.getAccessTokenSilently({}).subscribe(token => {
      this.accessToken = token;
      console.log(token);
    });
  }
}

import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IdToken, LogoutOptions, User } from '@auth0/auth0-spa-js';
import { Observable, of, Subscription } from 'rxjs';
import { UserService } from './user.service';
import jwt_decode from "jwt-decode";
import { Article } from '../models/Article';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  private _accessToken: string = '';
  private _parsedToken: any = {};

  claims: IdToken | undefined | null;
  user: User | null | undefined;
  isAuthenticated: boolean = false;
  profile: User | null | undefined;

  private _checker = (arr: string[], target: string[]) => target?.every(v => arr?.includes(v));

  public hasPermission(permissions: string[]): Boolean {
    return this._checker(this._parsedToken.permissions, permissions);
  }

  public get isArticleWriter(): Boolean {
    return this.hasPermission(['write:articles']);
  }

  public get isArticlePublisher(): Boolean {
    return this.hasPermission(['write:articles', 'publish:articles']);
  }

  public get isReviewWriter(): Boolean {
    return this.hasPermission(['write:reviews']);
  }

  public get isReviewPublisher(): Boolean {
    return this.hasPermission(['write:reviews', 'publish:reviews']);
  }

  public get isEventWriter(): Boolean {
    return this.hasPermission(['write:articles']);
  }

  public get isEventPublisher(): Boolean {
    return this.hasPermission(['write:events', 'publish:events']);
  }

  public get isUserAdmin(): Boolean {
    return this.hasPermission(['write:users']);
  }

  public get isUserViewer(): Boolean {
    return this.hasPermission(['write:users']);
  }

  public get user$(): Observable<User | null | undefined> {
    return this._authService.user$;
  }

  public hasAccessArticleEdit(article: Article): Boolean {
    if (article?.author !== (this.user?.email as string) && !this.isArticlePublisher)
      return false;

    return this.isArticleWriter;
  }

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
      this._accessToken = token;
      this._parsedToken = jwt_decode(this._accessToken);
    }, error => {
      console.log('Login required.')
    });
  }
}

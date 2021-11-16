import { Injectable, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IdToken, LogoutOptions, User } from '@auth0/auth0-spa-js';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { UserService } from './user.service';
import jwt_decode from "jwt-decode";
import { Article } from '../models/Article';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService implements OnInit {
  private _accessToken: string = '';
  private _parsedToken: any = {};

  claims: IdToken | undefined | null;
  user: User | null | undefined;
  isAuthenticated: boolean = false;
  profile: User | null | undefined;

  private _checker = (arr: string[], target: string[]) => target?.every(v => arr?.includes(v));

  public successMessage = new Observable<string>();
  public warningMessage?: string;
  public errorMessage?: string;

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

  ngOnInit(): void {
  }

  public openSnackBar(message: string) {
    this._snackBar.open(message, 'lukk', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
    });
  }

  constructor(private _authService: AuthService, private _userService: UserService, private _snackBar: MatSnackBar) {
    this._authService.error$.subscribe(error => {
    });
    this._authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this._authService.user$.subscribe(user => {
        this.profile = user;
        this.user = user;
        if (user) {
          this._authService.idTokenClaims$.subscribe((claims) => {
            this.claims = claims;
          }, error => {
            this.openSnackBar(`idTokenClaims error: ${error}.`);
          });
          this._authService.getAccessTokenSilently({}).subscribe(token => {
            this._accessToken = token;
            this._parsedToken = jwt_decode(this._accessToken);
          }, error => {
            this.openSnackBar(`getAccessTokenSilently error: ${error}.`);
          });
          this.openSnackBar(`User ${user?.email} - successfully authenticated.`);
        }
      }, error => {
        this.openSnackBar(`User error: ${error}.`);
      });
    }, error => {
      this.openSnackBar(`isAuthenticated error: ${error}.`);
    });
  }
}

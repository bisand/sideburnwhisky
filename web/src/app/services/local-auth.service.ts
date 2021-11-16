import { Injectable, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IdToken, LogoutOptions, User } from '@auth0/auth0-spa-js';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { UserService } from './user.service';
import jwt_decode from "jwt-decode";
import { Article } from '../models/Article';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService implements OnInit {
  private _accessToken: string = '';
  private _parsedToken: any = {};
  private _success = new Subject<string>();
  private _warning = new Subject<string>();
  private _error = new Subject<string>();

  alertSuccess: NgbAlert | undefined;
  alertWarning: NgbAlert | undefined;
  alertError: NgbAlert | undefined;

  claims: IdToken | undefined | null;
  user: User | null | undefined;
  isAuthenticated: boolean = false;
  profile: User | null | undefined;

  private _checker = (arr: string[], target: string[]) => target?.every(v => arr?.includes(v));

  public successMessage?: string;
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

  constructor(private _authService: AuthService, private _userService: UserService) {
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.alertSuccess) {
        this.alertSuccess.close();
      }
    });
    this._warning.subscribe(message => this.warningMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.alertWarning) {
        this.alertWarning.close();
      }
    });
    this._error.subscribe(message => this.errorMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => {
      if (this.alertError) {
        this.alertError.close();
      }
    });

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
      this._success.next(`user ${user?.email} - successfully authenticated.`);
    }, error => {
      this._warning.next(`Login required: ${error}.`);
      console.log('Login required.')
    });
    this._authService.idTokenClaims$.subscribe((claims) => {
      this.claims = claims;
    }, error => {
      this._warning.next(`Login required: ${error}.`);
      console.log('Login required.')
    });
    this._authService.getAccessTokenSilently({}).subscribe(token => {
      this._accessToken = token;
      this._parsedToken = jwt_decode(this._accessToken);
    }, error => {
      this._warning.next(`Login required: ${error}.`);
      console.log('Login required.')
    });
  }
}

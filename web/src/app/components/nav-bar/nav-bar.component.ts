import { Component, OnInit } from '@angular/core';
import { LocalAuthService } from '../../services/local-auth.service';
import { User } from '@auth0/auth0-spa-js';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  public isMenuCollapsed = true;
  public get isAuthenticated(): Boolean{
    return this.auth.isAuthenticated;
  }
  public get profile(): User | null | undefined{
    return this.auth.profile;
  }


  constructor(public auth: LocalAuthService) { }

  ngOnInit(): void {
  }

  loginWithRedirect(): void {
    this.auth.loginWithRedirect();
  }

  logoutWithRedirect(): void {
    // const url = this.auth.buildLogoutUrl({ returnTo: `${window.location.origin + '/portfolio/'}` }).subscribe(url => {
    // });
    this.auth.logout({ returnTo: `${window.location.origin + '/'}` });
  }

}

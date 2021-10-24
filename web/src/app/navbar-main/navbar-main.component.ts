import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar-main',
  templateUrl: './navbar-main.component.html',
  styleUrls: ['./navbar-main.component.scss']
})
export class NavbarMainComponent implements OnInit {

  public isMenuCollapsed = true;

  constructor(public auth: AuthService) { }

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

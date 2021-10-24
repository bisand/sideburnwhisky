import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

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

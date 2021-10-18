import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sideburn Whiskylaug';
  public isMenuCollapsed = true;

  constructor(public auth: AuthService){
    
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

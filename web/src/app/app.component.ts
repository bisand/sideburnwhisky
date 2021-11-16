import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { LocalAuthService } from './services/local-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'Sideburn Whiskylaug';

  @ViewChild('alertSuccess', { static: false }) alertSuccess: NgbAlert | undefined;
  @ViewChild('alertWarning', { static: false }) alertWarning: NgbAlert | undefined;
  @ViewChild('alertError', { static: false }) alertError: NgbAlert | undefined;

  constructor(public auth: LocalAuthService) {
    auth.successMessage = ' ';
    auth.warningMessage = ' ';
    auth.errorMessage = ' ';
  }
  ngAfterViewInit(): void {
    this.auth.alertSuccess = this.alertSuccess;
    this.auth.alertWarning = this.alertWarning;
    this.auth.alertError = this.alertError;
    this.auth.successMessage = '';
    this.auth.warningMessage = '';
    this.auth.errorMessage = '';
  }
}

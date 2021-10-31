import { Component, OnInit } from '@angular/core';
import { LocalAuthService } from 'src/app/services/local-auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(public auth: LocalAuthService) { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { User } from '@auth0/auth0-spa-js';
import { Observable } from 'rxjs';
import { ArticleService } from 'src/app/services/article.service';
import { LocalAuthService } from '../../services/local-auth.service';

@Component({
  selector: 'app-article-tool-box',
  templateUrl: './article-tool-box.component.html',
  styleUrls: ['./article-tool-box.component.scss']
})
export class ArticleToolBoxComponent implements OnInit {

  public get isAuthenticated(): Boolean{
    return this._auth.isAuthenticated;
  }
  public get profile(): User | null | undefined{
    return this._auth.profile;
  }

  constructor(private _auth: LocalAuthService, private _articleService: ArticleService) {
  }

  ngOnInit(): void {
  }

}

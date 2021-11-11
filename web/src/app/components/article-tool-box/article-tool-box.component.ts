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
  articles: any = [];

  constructor(public auth: LocalAuthService, private _articleService: ArticleService) {
  }

  ngOnInit(): void {
    this._articleService.getUnpublishedArticles().subscribe((data: any[]) => {
      this.articles = data;
    }, error => {
      console.log(error);
    });
  }

  public async deleteArticle(id: string) {
    await this._articleService.deleteArticle(id).toPromise();
    this._articleService.getUnpublishedArticles().subscribe((data: any[]) => {
      this.articles = data;
    }, error => {
      console.log(error);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/models/Article';
import { ArticleService } from 'src/app/services/article.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import * as marked from 'marked';

@Component({
  selector: 'app-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss']
})
export class ArticleViewerComponent implements OnInit {

  private _routeSub!: Subscription;
  private _articleId: string | undefined;
  public article!: Article;

  constructor(public auth: LocalAuthService, private _articleService: ArticleService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._routeSub = this._route.params.subscribe(params => {
      this._articleId = params['id'];
      if (this._articleId) {
        this._articleService.getArticle(this._articleId).subscribe((data: any) => {
          this.article = data;
        }, error => {
          console.log(error);
        });
      }
    });
  }

  public compileMarkdown(value: string | undefined): string {
    if (value)
      return marked.parser(marked.lexer(value));
    return '';
  }
}

import { Component, OnInit } from '@angular/core';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { ArticleService } from '../../services/article.service';
import * as marked from 'marked';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  articles: any = [];

  constructor(public auth: LocalAuthService, private _articleService: ArticleService) { }

  ngOnInit(): void {
    this._articleService.getArticles().subscribe((data: any[]) => {
      this.articles = data;
    }, error => {
      console.log(error);
    });
  }

  public compileMarkdown(value: string | undefined): string {
    if (value)
      return marked.parser(marked.lexer(value));
    return '';
  }
}

import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/Article';
import { ArticleService } from 'src/app/services/article.service';
import { LocalAuthService } from '../../services/local-auth.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-article-tool-box',
  templateUrl: './article-tool-box.component.html',
  styleUrls: ['./article-tool-box.component.scss']
})
export class ArticleToolBoxComponent implements OnInit {
  articles: any = [];

  constructor(public auth: LocalAuthService, private _articleService: ArticleService, private _modalService: NgbModal) {
  }

  ngOnInit(): void {
    this._articleService.getUnpublishedArticles().subscribe((data: any[]) => {
      this.articles = data;
    }, error => {
      console.log(error);
    });
  }

  public async deleteArticle(article: Article) {
    let modalRef = this._modalService.open(ConfirmModalComponent, { windowClass: 'dark-modal', modalDialogClass: 'dark-modal' });
    (modalRef.componentInstance as ConfirmModalComponent).textTitle = 'Slett artikkel';
    (modalRef.componentInstance as ConfirmModalComponent).textBody = `<p>Er du sikker på at du vil slette artikkelen "${article.title}"?</p><p>Forfatter: ${article.author}</p>`;
    let result = await modalRef.result.then();
    if (result === 'OK') {
      await this._articleService.deleteArticle(article._id).toPromise();
      this._articleService.getUnpublishedArticles().subscribe((data: any[]) => {
        this.articles = data;
      }, error => {
        console.log(error);
      });
    }
  }

}

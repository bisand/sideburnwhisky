import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as marked from 'marked';
import { Observable, Subscription } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { Article } from 'src/app/models/Article';
import { ActivatedRoute, Router } from '@angular/router';
import { IArticle } from 'src/app/models/IArticle';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ComponentCanDeactivate } from '../../pending-changes.guard';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import * as DOMPurify from 'dompurify';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent implements ComponentCanDeactivate, OnInit, OnDestroy {

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload')
  canDeactivate(): boolean | Observable<boolean> {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return this.article?.title === this.formModel.title.value
      && this.article?.subject === this.formModel.subject.value
      && this.article?.body === this.formModel.body.value;
  }

  private _routeSub!: Subscription;
  private _articleId: string | undefined;
  public article!: Article;

  public formModel: { [key in keyof IArticle]: FormControl } = {
    title: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    dateCreated: new FormControl(Date.now()),
    dateModified: new FormControl(Date.now()),
    datePublished: new FormControl(null),
    publishDate: new FormControl(null),
    author: new FormControl(null),
    tags: new FormControl(null),
    image: new FormControl(null),
    active: new FormControl(false),
    published: new FormControl(false)
  };
  form: FormGroup = new FormGroup(this.formModel);

  public activeTab: number;
  public canSaveArticle!: boolean;
  public canPublishArticle!: boolean;

  public get hasImage(): Boolean {
    return this.imageUrl !== this.imageUrlDefault;
  }

  public get f() { return this.formModel; }
  public get articleReady() { return this.article !== undefined }

  public compiledBodyMarkdown?: string;
  public imageUrlDefault = '../assets/images/picture_placeholder.png';
  public imageUrl = this.imageUrlDefault;

  public selectedFiles?: FileList;
  public progressInfos: any[] = [];
  public imageInfos?: Observable<any>;

  constructor(
    public auth: LocalAuthService,
    private _articleService: ArticleService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _route: ActivatedRoute,
    private _modalService: NgbModal,
    private _router: Router) {

    this.activeTab = 0;

  }
  ngOnDestroy(): void {
    this._routeSub.unsubscribe();
  }

  ngOnInit(): void {

    this.form.statusChanges.subscribe(val => {
      if (val === 'VALID') {
        this.canSaveArticle = true;
        this.canPublishArticle = this.article._id !== undefined;
      } else {
        this.canSaveArticle = false;
        this.canPublishArticle = false;
      }
    });

    this.f.body?.valueChanges.subscribe(val => {
    });

    this.f.title?.valueChanges.subscribe(val => {
    });

    this.f.subject?.valueChanges.subscribe(val => {
    });

    this._routeSub = this._route.params.subscribe(params => {
      this._articleId = params['id'];
      this.canSaveArticle = true;
      if (this._articleId) {
        this._articleService.getArticle(this._articleId).subscribe((data: any) => {
          this.article = data;
          this.form.patchValue(this.article);
          this.canPublishArticle = true;
        }, error => {
          console.log(error);
        });
      } else {
        this.auth.user$.subscribe(user => {
          this.article = new Article(user?.email as string);
          this.form.patchValue(this.article);
          this.canSaveArticle = false;
          this.canPublishArticle = false;
        });
      }
    });
  }

  public onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 1) {
      this.compiledBodyMarkdown = DOMPurify.sanitize(this.compileMarkdown(this.f.body.value));
    }
  }

  public selectFiles(event: any): void {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.imageUrl = e.target.result;
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  public uploadFiles(): void {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  public upload(idx: number, file: File): void {
    if (file) {
      this.progressInfos[idx] = { value: 0, fileName: file.name };
      this._articleService.uploadImage(file).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.openSnackBar(msg);
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          this.progressInfos = [];
          const msg = 'Could not upload the file: ' + file.name;
          this.openSnackBar(msg);
        });
    }
  }

  public onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.formModel.title);
  }

  public async saveArticle() {
    Object.assign(this.article, this.form.getRawValue());
    if (this.article.published) {
      const articleConfirm = await this.confirm('Lagre artikkel', 'Artikkelen er allerede publisert. Er du sikker på at du vil lagre endringene?');
      if (!articleConfirm) {
        return;
      }
    }
    const result = await this._articleService.saveArticle(this.article).toPromise();
  }

  public async publishArticle() {
    const articleConfirm = await this.confirm('Publisere artikkel', 'Du er i ferd med å publisere artikkelen. Er du sikker på at du vil fortsette?');
    if (!articleConfirm) {
      return;
    }
    Object.assign(this.article, this.form.getRawValue());
    const result = await this._articleService.publishArticle(this.article);
    this._router.navigate(['artikkel', result._id]);
  }

  public async unpublishArticle() {
    const articleConfirm = await this.confirm('Avpublisere artikkel', '<div class="btn-danger">Du er i ferd med å avpublisere artikkelen. Er du sikker på at du vil fortsette?</div>');
    if (!articleConfirm) {
      return;
    }
    Object.assign(this.article, this.form.getRawValue());
    this.article = await this._articleService.unpublishArticle(this.article);
  }

  public newArticle() {
    this.article = new Article(this.auth.profile?.email as string);
    this.article.title = '';
  }

  private async confirm(title: string, message: string): Promise<boolean> {
    let modalRef = this._modalService.open(ConfirmModalComponent, { windowClass: 'dark-modal', modalDialogClass: 'dark-modal' });
    (modalRef.componentInstance as ConfirmModalComponent).textTitle = title;
    (modalRef.componentInstance as ConfirmModalComponent).textBody = message;
    let result = await modalRef.result.then();
    if (result === 'OK') {
      return true;
    }
    return false;
  }

  public openSnackBar(message: string) {
    this._snackBar.open(message, 'lukk', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
    });
  }

  private compileMarkdown(value: string): string {
    return marked.parser(marked.lexer(value));
  }
}


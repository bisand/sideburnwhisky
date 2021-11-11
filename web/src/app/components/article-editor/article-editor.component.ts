import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as marked from 'marked';
import { Observable, Subscription } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { Article } from 'src/app/models/Article';
import { ActivatedRoute } from '@angular/router';
import { IArticle } from 'src/app/models/IArticle';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent implements OnInit {

  private _routeSub!: Subscription;
  private _articleId: string | undefined;
  public article!: Article;

  public formModel: { [key in keyof IArticle]: FormControl } = {
    title: new FormControl(null, Validators.required),
    subject: new FormControl(null, Validators.required),
    body: new FormControl(null, Validators.required),
    dateCreated: new FormControl(null, Validators.required),
    dateModified: new FormControl(null, Validators.required),
    datePublished: new FormControl(null, Validators.required),
    publishDate: new FormControl(null, Validators.required),
    author: new FormControl(null, Validators.required),
    tags: new FormControl(null, Validators.required),
    image: new FormControl(null, Validators.required),
  };
  form: FormGroup = new FormGroup(this.formModel);

  public activeTab: number;

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
    private _route: ActivatedRoute) {

    this.activeTab = 0;

  }

  ngOnInit(): void {

    this.f.body?.valueChanges.subscribe(val => {
    });

    this.f.title?.valueChanges.subscribe(val => {
    });

    this.f.subject?.valueChanges.subscribe(val => {
    });

    this._routeSub = this._route.params.subscribe(params => {
      this._articleId = params['id'];
      if (this._articleId) {
        this._articleService.getArticle(this._articleId).subscribe((data: any) => {
          this.article = data;
          this.form.patchValue(this.article);
        }, error => {
          console.log(error);
        });
      } else {
        this.article = new Article(this.auth.profile?.email as string);
        this._articleId = undefined;
      }
    });
  }

  public onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 1) {
      this.compiledBodyMarkdown = this.compileMarkdown(this.f.body.value);
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
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
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

  public newArticle() {
    this.article = new Article(this.auth.profile?.email as string);
    //this.activeTab.pipe() = 0;
    this.article.title = '';
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

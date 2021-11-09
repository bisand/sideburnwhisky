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

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent implements OnInit {

  private _routeSub!: Subscription;
  private _articleId: string | undefined;
  public article!: Article;

  public articleForm = this._formBuilder.group({
    articleTitle: ['', Validators.required],
    articleSubject: ['', Validators.required],
    articleBody: ['', Validators.required],
  });
  public activeTab: number = 0;

  public get hasImage(): Boolean {
    return this.imageUrl !== this.imageUrlDefault;
  }

  public get f() { return this.articleForm.controls; }
  public get articleReady() { return this.article !== undefined }

  public compiledMarkdown?: string;
  public startingValue = '';
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
    private _route: ActivatedRoute) { }

  onValueChange(e: any) {
    if (!this.f.articleBody) {
      // reset to initial state
      this.compiledMarkdown = this.compileMarkdown(this.startingValue);
    } else {
      this.compiledMarkdown = this.compileMarkdown(this.f.articleBody.value);
    }
  }

  ngOnInit(): void {
    this.startingValue = this.getPlaceHolder();
    this.compiledMarkdown = this.compileMarkdown(this.startingValue);
    this.f.articleBody.valueChanges.subscribe(val => {
      this.compiledMarkdown = this.compileMarkdown(val !== '' ? val : this.startingValue);
    });

    this._routeSub = this._route.params.subscribe(params => {
      this._articleId = params['id'];
      if (this._articleId) {
        this._articleService.getArticle(this._articleId).subscribe((data: any) => {
          this.article = data;
        }, error => {
          console.log(error);
        });
      } else {
        this.article = new Article(this.auth.profile?.email as string);
        this._articleId = undefined;
      }
    });
  }

  selectFiles(event: any): void {
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

  uploadFiles(): void {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
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

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.articleForm.value);
  }

  newArticle(){
    this.article = new Article(this.auth.profile?.email as string);
    this.activeTab = 0;
    this.article.title='';
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'lukk', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
    });
  }

  private compileMarkdown(value: string): string {
    return marked.parser(marked.lexer(value));
  }

  private getPlaceHolder() {
    return (
      '# Title \n' +
      '## Title\n' +
      '### Title\n' +
      '#### Title\n\n' +

      '**bold**\n\n' +

      '*italic*\n\n' +

      'inline `code`\n\n' +

      '### code block\n' +
      '```\n' +
      `const foo = () => {
        return 1;
      }\n` +

      '```\n\n' +

      '### unorderd list\n' +
      '- item 1\n' +
      '* item 2\n\n' +

      '### orderd list\n\n' +
      '1. item a\n' +
      '2. item b'
    );
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as marked from 'marked';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent implements OnInit {

  articleForm = this._formBuilder.group({
    articleTitle: ['', Validators.required],
    articleSubject: ['', Validators.required],
    articleBody: ['', Validators.required],
  });

  get f() { return this.articleForm.controls; }

  compiledMarkdown?: string;
  startingValue = '';

  constructor(private _formBuilder: FormBuilder) { }

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

  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.articleForm.value);
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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as marked from 'marked';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss']
})
export class ArticleEditorComponent implements OnInit {

  articleTitle?: string;
  articleSubject?: string;
  articleBody?: string;
  compiledMarkdown?: string;
  startingValue = '';

  constructor() { }

  onValueChange(e: any) {
    this.articleBody = e.target.value;

    if (!this.articleBody) {
      // reset to initial state
      this.compiledMarkdown = this.compileMarkdown(this.startingValue);
    } else {
      this.compiledMarkdown = this.compileMarkdown(this.articleBody);
    }
  }

  ngOnInit(): void {
    this.startingValue = this.getPlaceHolder();
    this.compiledMarkdown = this.compileMarkdown(this.startingValue);
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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleToolBoxComponent } from './article-tool-box.component';

describe('ArticleToolBoxComponent', () => {
  let component: ArticleToolBoxComponent;
  let fixture: ComponentFixture<ArticleToolBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleToolBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleToolBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

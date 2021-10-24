import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiskeyComponent } from './whiskey.component';

describe('WhiskeyComponent', () => {
  let component: WhiskeyComponent;
  let fixture: ComponentFixture<WhiskeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhiskeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiskeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

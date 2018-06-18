import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineEditTextareaComponent } from './inline-edit-textarea.component';

describe('InlineEditTextareaComponent', () => {
  let component: InlineEditTextareaComponent;
  let fixture: ComponentFixture<InlineEditTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineEditTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineEditTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

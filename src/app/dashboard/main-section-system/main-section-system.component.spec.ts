import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSectionSystemComponent } from './main-section-system.component';

describe('MainSectionSystemComponent', () => {
  let component: MainSectionSystemComponent;
  let fixture: ComponentFixture<MainSectionSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSectionSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSectionSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

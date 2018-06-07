import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSectionEntityComponent } from './main-section-entity.component';

describe('MainSectionEntityComponent', () => {
  let component: MainSectionEntityComponent;
  let fixture: ComponentFixture<MainSectionEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSectionEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSectionEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCaseComponent } from './toggle-case.component';

describe('ToggleCaseComponent', () => {
  let component: ToggleCaseComponent;
  let fixture: ComponentFixture<ToggleCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

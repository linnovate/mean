import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSystemComponent } from './system.component';

describe('NewLoadedPlatformComponent', () => {
  let component: NewSystemComponent;
  let fixture: ComponentFixture<NewSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

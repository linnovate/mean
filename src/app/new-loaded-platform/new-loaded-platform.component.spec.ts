import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoadedPlatformComponent } from './new-loaded-platform.component';

describe('NewLoadedPlatformComponent', () => {
  let component: NewLoadedPlatformComponent;
  let fixture: ComponentFixture<NewLoadedPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLoadedPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLoadedPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

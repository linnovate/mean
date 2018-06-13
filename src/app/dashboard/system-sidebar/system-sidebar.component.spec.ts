import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSidebarComponent } from './system-sidebar.component';

describe('SystemSidebarComponent', () => {
  let component: SystemSidebarComponent;
  let fixture: ComponentFixture<SystemSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

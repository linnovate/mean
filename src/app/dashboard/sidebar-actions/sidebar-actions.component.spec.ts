import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarActionsComponent } from './sidebar-actions.component';

describe('SidebarActionsComponent', () => {
  let component: SidebarActionsComponent;
  let fixture: ComponentFixture<SidebarActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

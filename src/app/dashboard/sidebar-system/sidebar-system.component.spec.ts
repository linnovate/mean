import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSystemComponent } from './sidebar-system.component';

describe('SidebarSystemComponent', () => {
  let component: SidebarSystemComponent;
  let fixture: ComponentFixture<SidebarSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

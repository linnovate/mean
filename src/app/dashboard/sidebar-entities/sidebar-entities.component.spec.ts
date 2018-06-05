import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEntitiesComponent } from './sidebar-entities.component';

describe('SidebarEntitiesComponent', () => {
  let component: SidebarEntitiesComponent;
  let fixture: ComponentFixture<SidebarEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

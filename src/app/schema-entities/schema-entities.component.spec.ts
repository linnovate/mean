import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaEntitiesComponent } from './schema-entities.component';

describe('SchemaEntitiesComponent', () => {
  let component: SchemaEntitiesComponent;
  let fixture: ComponentFixture<SchemaEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

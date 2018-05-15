import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSchemaEntityComponent } from './new-schema-entity.component';

describe('NewSchemaEntityComponent', () => {
  let component: NewSchemaEntityComponent;
  let fixture: ComponentFixture<NewSchemaEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSchemaEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSchemaEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

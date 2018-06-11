import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityService } from '../../entity/entity.service';
import { SchemaService } from '../../schema/schema.service';

import schema from '../../../../examples/platform.json';

@Component({
  selector: 'app-main-section-entity',
  templateUrl: './main-section-entity.component.html',
  styleUrls: ['./main-section-entity.component.scss']
})
export class MainSectionEntityComponent implements OnInit {

  name: string;
  modeName: string;
  description: string;
  statuses: string[] = ['draft', 'waiting', 'approved', 'rejected'];
  status: string;
  cases: string[] = ['foe', 'friend', 'neutral'];
  activeCase: number;
  formFields: any;
  formValues: any;
  schema: any;
  entity: any;
  schemaType: string;
  originalModeName: string;

  toggleCase() {
    let active = this.activeCase;
    let maxLength = this.cases.length - 2;
    this.activeCase = active > maxLength ? 0: active + 1;
  }

  update() {
    // if originalModeName === '' it is a new mode
    this.entityService.update(this.entity._id, this.originalModeName, {
      name: this.name,
      description: this.description,
      case: this.cases[this.activeCase],
      modes: [{
        name: this.modeName,
        status: this.status,
        data: this.formValues
      }]
    }).subscribe((entity: any) => {
      this.router.navigate([this.schemaType, entity._id, this.modeName]);
      this.entityService.subject.next({
        action: this.originalModeName === '' ? 'new mode' : 'update mode',
        mode: entity.modes.find(e => e.name === this.modeName)
      });
    });
  }

  save() {
    if (this.entity) return this.update(); 
    this.entityService.save({
      schema: this.schema._id,
      name: this.name,
      description: this.description,
      case: this.cases[this.activeCase],
      modes: [{
        name: this.modeName,
        status: this.status,
        data: this.formValues
      }]
    }).subscribe((entity: any) => {
      this.router.navigate([this.schemaType, entity._id, entity.modes[0].name]);
      this.entityService.subject.next({
        action: 'new entity',
        entity: entity
      });
    });
  }

  cancel() {
    console.log('cancel() was invoked')
  }

  delete() {
    // this.entityService.delete('1')
  }

  constructor(private entityService: EntityService, private route: ActivatedRoute, private schemaService: SchemaService, private router: Router) { }


  initInitialValues(schema, entity?) {
    this.schema = schema;
    entity = entity || {};
    entity.modes = entity.modes || [{}];
    const mode = entity.modes[0];
    this.name = entity.name || '';
    this.modeName = mode.name || '';
    this.originalModeName = this.modeName;
    this.description = entity.description || '';
    this.status = mode.status || 'draft';
    this.formFields = schema.fields;
    this.formValues = mode.data || {};
  }

  initExistsEntity(params) {
    this.entityService.findOne(params.entityId, params.modeName).subscribe((entity: any) => {
      this.entity = entity;
      this.initInitialValues(entity._schema, entity);
    });
  }

  initNewEntity(category) {
    this.schemaService.find(this.schemaType, category).subscribe(schema => {
      this.initInitialValues(schema[0]);
    });
  }
  
  ngOnInit() {
    this.activeCase = 0;
    this.route.parent.params.subscribe(pParams => {
      this.schemaType = pParams.type;
      this.route.params.subscribe(params => {
        if (params.entityId) return this.initExistsEntity(params);
        this.initNewEntity(params.category);
      });
    });
  }
}

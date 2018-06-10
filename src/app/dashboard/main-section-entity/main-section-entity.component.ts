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
  status: string;
  cases: string[];
  activeCase: number;
  formFields: any;
  formValues: any;
  schema: string;
  entity: any;
  type: string;
  originalModeName: string;

  toggleCase() {
    let active = this.activeCase;
    let maxLength = this.cases.length - 2;
    this.activeCase = active > maxLength ? 0: active + 1;
  }

  update() {
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
      //check how to get the type here
      if (this.originalModeName !== this.modeName)
        this.router.navigate(['entity', entity._id, entity.modes[0].name])
    });
  }

  save() {
    if (this.entity) return this.update(); 
    this.entityService.save({
      schema: this.schema,
      name: this.name,
      description: this.description,
      case: this.cases[this.activeCase],
      modes: [{
        name: this.modeName,
        status: this.status,
        data: this.formValues
      }]
    }).subscribe((entity: any) => {
      this.router.navigate([this.type, entity._id, entity.modes[0].name])
    });
  }

  cancel() {
    console.log('cancel() was invoked')
  }

  delete() {
    this.entityService.delete('1')
  }

  constructor(private entityService: EntityService, private route: ActivatedRoute, private schemaService: SchemaService, private router: Router) { }


  initInitialValues(schema, entity?) {
    this.schema = schema._id;
    entity = entity|| {
      modes: []
    };
    const mode = entity.modes[0] || {};
    this.name = entity.name || '';
    this.modeName = mode.name || '';
    this.originalModeName = this.modeName;
    console.log(this.modeName);
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

  initNewEntity() {
    this.route.parent.params.subscribe(pParams => {
      this.route.params.subscribe(params => {
        this.type = params.type;
        this.schemaService.find(pParams.type, params.category).subscribe(schema => {
        this.initInitialValues(schema[0]);
        })
      });
    });
  }
  
  ngOnInit() {
    this.cases = ['foe', 'friend', 'neutral'];
    this.activeCase = 0;
    this.route.params.subscribe(params => {
      if (params.entityId) return this.initExistsEntity(params);
      this.initNewEntity();
    });
  }

}

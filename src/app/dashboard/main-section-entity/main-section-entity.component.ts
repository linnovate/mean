import { Component, OnInit } from '@angular/core';

import { EntityService } from '../../entity/entity.service';

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

  toggleCase() {
    let active = this.activeCase;
    let maxLength = this.cases.length - 2;
    this.activeCase = active > maxLength ? 0: active + 1;
  }

  save() {
    this.entityService.save({
      name: this.name,
      modeName: this.modeName,
      description: this.description,
      status: this.status,
      case: this.cases[this.activeCase],
      fields: this.formValues
    })
  }

  cancel() {
    console.log('cancel() was invoked')
  }

  delete() {
    this.entityService.delete('1')
  }

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.name = '';
    this.modeName = '';
    this.description = '';
    this.status = 'draft';
    this.cases = ['foe', 'friend', 'neutral'];
    this.activeCase = 0;
    this.formFields = schema.fields;
    this.formValues = {};
    console.log(this.formFields)
  }

}

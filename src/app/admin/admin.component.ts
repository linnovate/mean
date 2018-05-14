import { Component, OnInit } from '@angular/core';
import { SchemaService } from '../schema/schema.service';

@Component({
  selector: 'admin-module',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

  constructor(private schemaService: SchemaService) {}

  schemas:Array<any>;
  platforms:Array<any>;
  equipments:Array<any>;
  json: Object;
  title: string;

  evaluate(string) {
    return Boolean(eval(string));
  }

  public ngOnInit() {
    this.schemaService.find().subscribe(schemas => {
      this.platforms = schemas.filter(schema => schema.map === 'platformMode');
      this.equipments = schemas.filter(schema => schema.map === 'equipment');
    });
    this.json = {
      name: 'something'
    };
    this.title = 'app';
    // this.evaluate = this.evaluate.bind(this.json);
  }
}



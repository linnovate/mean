import { Component, OnInit } from '@angular/core';
import { SchemaService } from '../schema/schema.service';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit {

  constructor(private schemaService: SchemaService) {}

  schemas:Array<any>;
  json: Object;

  public ngOnInit() {
    this.schemaService.find().subscribe(schemas => {
      this.schemas = schemas;
    });
    this.json = {
      name: 'something'
    };
  }

}

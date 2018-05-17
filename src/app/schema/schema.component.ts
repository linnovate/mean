import { Component, OnInit } from '@angular/core';
import { SchemaService } from '../schema/schema.service';
import { EntityDataService } from '../schema-entities/entity-data.service';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit {

  constructor(private schemaService: SchemaService, private entityDataService: EntityDataService) {}

  schemas:Array<any>;
  data: Object;
  json: Object = {};
  schemaName: Object = {};
  options: any = {};
  activeSchema: Object = {};
  
  getSchemas() {
    let equipmentSchemaId;
    this.schemaService.find().subscribe(schemas => {
      this.schemas = schemas;
      schemas.forEach(schema => {
        if (schema.type === 'equipment') equipmentSchemaId = schema._id;
        this.schemaName[schema._id] = schema.label;
      });
      this.schemaService.setSharedData({activeSchema :schemas[0], equipmentSchemaId});
    });
  }

  setActiveSchema(schema) {
    this.schemaService.setSharedData({activeSchema: schema});
  }

  setJson(schemaIndex, dataIndex) {
    this.json = this.data[schemaIndex].data[dataIndex].data;
    this.options.entityDataId = this.data[schemaIndex].data[dataIndex]._id;
  }


  public ngOnInit() {
    this.getSchemas();
  }

}

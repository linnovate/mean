import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Overlay} from '@angular/cdk/overlay';
import {SchemaService} from '../schema/schema.service';
import {EntityService} from '../entity/entity.service';

import {NewSchemaEntityComponent} from '../new-schema-entity/new-schema-entity.component';
import {NewSystemComponent} from '../system/system.component';


@Component({
  selector: 'app-schema-entities',
  templateUrl: './schema-entities.component.html',
  styleUrls: ['./schema-entities.component.scss']
})
export class SchemaEntitiesComponent implements OnInit {

  type: string;
  entities: Array<object> = [];
  equipmentSchemaId: string;
  schemas: Array<object>;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private schemaService: SchemaService, private entityService: EntityService) {
    this.route.params.subscribe( params => {
      this.type = params.type
      this.getSchemas(this.type);
      this.getData(this.type);
    });
   }
   

  ngOnInit() {
  }

  getData(type) {
    this.entityService.find(type).subscribe(data => {
      this.entities = data;
    });
  }

  getSchemas(type) {
    this.schemaService.find(type).subscribe(schemas => {
      this.schemas = schemas;
    });
  }

  clone(entity) {
    this.entityService.clone(entity._id).subscribe(data => {
      console.log('cloned entity', data);
    });
  }

  delete(entity) {
    this.entityService.delete(entity._id).subscribe(data => {
      console.log('deleted entity', data);
    })
  }

  openEntityDialog(entity): void {

    let data:any = {};
    data.schemas = this.schemas;
    data.entity = entity;

    let dialogRef = this.dialog.open(NewSchemaEntityComponent, {
      width: '1000px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openEquipDialog(platform) {
    let data:any = {};
    data.platform = platform;

    let dialogRef = this.dialog.open(NewSystemComponent, {
      width: '1000px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

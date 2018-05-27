import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Overlay} from '@angular/cdk/overlay';
import {SchemaService} from '../schema/schema.service';
import {EntityDataService} from '../schema-entities/entity-data.service';

import {NewSchemaEntityComponent} from '../new-schema-entity/new-schema-entity.component';
import {NewLoadedPlatformComponent} from '../new-loaded-platform/new-loaded-platform.component';


@Component({
  selector: 'app-schema-entities',
  templateUrl: './schema-entities.component.html',
  styleUrls: ['./schema-entities.component.scss']
})
export class SchemaEntitiesComponent implements OnInit {

  type: string;
  activeSchems: any;
  entities: any;
  equipmentSchemaId: string;
  schemas: Array<object>

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private schemaService: SchemaService, private entityDataService: EntityDataService) {
    this.route.params.subscribe( params => {
      this.type = params.type
      this.getSchemas(this.type);
    });
   }
   

  ngOnInit() {
  }

  getData() {
    if (!this.activeSchems || !this.activeSchems._id) return;
    this.entityDataService.find(this.activeSchems._id).subscribe(data => {
      this.entities = data;
    });
  }

  getSchemas(type) {
    this.schemaService.find(type).subscribe(schemas => {
      this.schemas = schemas;
    });
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
    data.equipmentSchemaId = this.equipmentSchemaId;

    let dialogRef = this.dialog.open(NewLoadedPlatformComponent, {
      width: '1000px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

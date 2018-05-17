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

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private schemaService: SchemaService, private entityDataService: EntityDataService) {
    this.route.params.subscribe( params => this.type = params.type );
    this.schemaService.activeSchema$.subscribe(active => {
      this.activeSchems = active;
      this.getData();
    });
    this.schemaService.equipmentSchemaId$.subscribe(id => this.equipmentSchemaId = id);
   }

  ngOnInit() {
  }

  getData() {
    if (!this.activeSchems || !this.activeSchems._id) return;
    this.entityDataService.find(this.activeSchems._id).subscribe(data => {
      this.entities = data;
    });
  }

  openEntityDialog(entity): void {

    let data:any = {};
    data.schema =  this.activeSchems;
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

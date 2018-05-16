import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Overlay} from '@angular/cdk/overlay';
import {SchemaService} from '../schema/schema.service';
import {EntityDataService} from '../schema-entities/entity-data.service';

import {NewSchemaEntityComponent} from '../new-schema-entity/new-schema-entity.component';


@Component({
  selector: 'app-schema-entities',
  templateUrl: './schema-entities.component.html',
  styleUrls: ['./schema-entities.component.scss']
})
export class SchemaEntitiesComponent implements OnInit {

  type: string;
  activeSchems: any;
  entities: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private schemaService: SchemaService, private entityDataService: EntityDataService) {
    this.route.params.subscribe( params => this.type = params.type );
    this.schemaService.activeSchema$.subscribe(active => {
      this.activeSchems = active;
      this.getData();
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

  openDialog(entity): void {

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

}

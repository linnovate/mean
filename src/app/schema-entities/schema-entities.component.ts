import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {NewSchemaEntityComponent} from '../new-schema-entity/new-schema-entity.component';


@Component({
  selector: 'app-schema-entities',
  templateUrl: './schema-entities.component.html',
  styleUrls: ['./schema-entities.component.scss']
})
export class SchemaEntitiesComponent implements OnInit {

  type: string;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.route.params.subscribe( params => this.type = params.type );
   }

  ngOnInit() {
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(NewSchemaEntityComponent, {
      width: '250px',
      data: { schema: {
        type: 'test'
      } }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

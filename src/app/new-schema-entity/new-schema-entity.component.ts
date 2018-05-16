import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-new-schema-entity',
  templateUrl: './new-schema-entity.component.html',
  styleUrls: ['./new-schema-entity.component.scss']
})
export class NewSchemaEntityComponent implements OnInit {

  json: Object = {};
  options: any = {};

  constructor(
    public dialogRef: MatDialogRef<NewSchemaEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
      console.log(this.data , 'this data in dialog component');
      if (this.data.entity) {
        this.json = this.data.entity.data;
        this.options.entityDataId = this.data.entity._id;
      }
    }

}


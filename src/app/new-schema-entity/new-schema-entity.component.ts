import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-new-schema-entity',
  templateUrl: './new-schema-entity.component.html',
  styleUrls: ['./new-schema-entity.component.scss']
})
export class NewSchemaEntityComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewSchemaEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }
  

  onNoClick(): void {
    this.dialogRef.close();
  }

}


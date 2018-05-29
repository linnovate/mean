import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { EntityService } from '../entity/entity.service';


@Component({
  selector: 'app-new-schema-entity',
  templateUrl: './new-schema-entity.component.html',
  styleUrls: ['./new-schema-entity.component.scss']
})
export class NewSchemaEntityComponent implements OnInit {

  json: Object = {};
  options: any = {};
  public schema;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private entityService: EntityService,
    public dialogRef: MatDialogRef<NewSchemaEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
      console.log(this.data , 'this data in dialog component');
    }

    moveToEntityPage(schemaId, name, description) {
      this.entityService.save(schemaId, {name, description})
      .subscribe(data => {
        this.dialogRef.close();
        this.router.navigate([`../../platform/${(<any>data)._id}`], { relativeTo: this.route });
      });
    }
}


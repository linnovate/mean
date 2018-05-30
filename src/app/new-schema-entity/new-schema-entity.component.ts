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

  params:any = {};
  json: Object = {};
  options: any = {};
  public schema;
  public entity:any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private entityService: EntityService,
    public dialogRef: MatDialogRef<NewSchemaEntityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
      console.log(this.data , 'this data in dialog component');
      const entity = this.data.entity;    
      if (entity) {
        this.entity = this.data.entity;
        this.schema = this.data.entity._schema;
      }
    }

    create(schemaId) {
      this.entityService.save(schemaId, this.entity)
      .subscribe((data:any) => {
        this.closeDialogAndNavigate(data._id)
      });

    }

    update() {
      this.entityService.update(this.entity._id, this.entity)
      .subscribe((data:any) => {
       this.closeDialogAndNavigate(data._id)
      });
    }

    closeDialogAndNavigate(id) {
      this.dialogRef.close();
      this.router.navigate([`../../${this.data.type}/${id}`], { relativeTo: this.route });
    }

    moveToEntityPage(schemaId) {
      if (this.entity._id) return this.update();
      this.create(schemaId);
    }
}


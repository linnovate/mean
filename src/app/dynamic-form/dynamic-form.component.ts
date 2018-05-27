import { Component, OnInit, Input } from '@angular/core';
import { EntityDataService } from '../schema-entities/entity-data.service';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})

export class DynamicFormComponent implements OnInit {

  @Input() schema: any;
  @Input() json: any = {};
  @Input() options: any = {};
  @Input() dialogRef: any;

  constructor(private entityDataService: EntityDataService) {}

  evaluate(string) {
    return Boolean(eval(string));
  }

  closeDialog() {
     this.dialogRef.close();
  }

  save() {
    // console.log('============', this.options, this.json, this.schema);
    // if (this.options.entityDataId) return this.update();
    this.entityDataService.save(this.schema._id, this.json)
      .subscribe(data => {
        console.log(data, 'schema data');
        this.closeDialog();
      });
  }

  update() {
    this.entityDataService.update(this.options.entityDataId, this.json)
      .subscribe(data => {
        console.log(data, 'schema updated data');
        this.closeDialog();
      });
  }

  ngOnInit() {
    this.evaluate = this.evaluate.bind(this.json);
  }
}

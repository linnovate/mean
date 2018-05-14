import { Component, OnInit, Input } from '@angular/core';
import { EntityDataService } from '../schema/entity-data.service';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})

export class DynamicFormComponent implements OnInit {

  @Input() schema: any;
  @Input() json: any = {};

  constructor(private entityDataService: EntityDataService) {}

  evaluate(string) {
    return Boolean(eval(string));
  }

  save() {
    this.entityDataService.save(this.schema._id, this.json)
      .subscribe(data => {
        console.log(data, 'schema data');
      });
  }

  ngOnInit() {
    this.evaluate = this.evaluate.bind(this.json);
  }
}

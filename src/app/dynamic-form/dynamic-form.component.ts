import { Component, OnInit, Input } from '@angular/core';
import * as schema from '../schema/equipment.json';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})

export class DynamicFormComponent implements OnInit {

  public title;
  public json;
  public schema;

  evaluate(string) {
    return Boolean(eval(string));
  }

  save() {
    console.log(this.json);
  }

  constructor() { }

  ngOnInit() {
    this.schema = schema;
    this.json = {
      name: 'something'
    };
    this.title = 'app';
      this.evaluate = this.evaluate.bind(this.json);
    }
}

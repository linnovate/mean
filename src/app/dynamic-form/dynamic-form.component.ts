import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})

export class DynamicFormComponent implements OnInit {

  @Input() schema: any;
  @Input() json: any = {};

  evaluate(string) {
    return Boolean(eval(string));
  }

  save() {
    console.log(this.json);
  }

  constructor() { }

  ngOnInit() {
    this.evaluate = this.evaluate.bind(this.json);
  }
}

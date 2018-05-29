import { Component, OnInit, Input } from '@angular/core';

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

  constructor() {}

  evaluate(string) {
    return Boolean(eval(string));
  }

  closeDialog() {
     this.dialogRef.close();
  }

  ngOnInit() {
    this.evaluate = this.evaluate.bind(this.json);
  }
}

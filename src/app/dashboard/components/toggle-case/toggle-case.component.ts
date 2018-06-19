import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-case',
  templateUrl: './toggle-case.component.html',
  styleUrls: ['./toggle-case.component.scss']
})
export class ToggleCaseComponent implements OnInit {

  @Output() iffChange = new EventEmitter();
  @Input() set iff(value: string) {
    this.activeCase = this.cases.findIndex(e => e === value);
  }

  cases: string[] = ['foe', 'friend', 'neutral'];
  activeCase: number;

  constructor() {}

  toggleCase() {
    let active = this.activeCase;
    let maxLength = this.cases.length - 2;
    this.activeCase = active > maxLength ? 0: active + 1;
    this.iffChange.emit(this.cases[this.activeCase]);
  }

  ngOnInit() {}

}

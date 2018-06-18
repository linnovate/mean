import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  @Input() placeholder: string = 'Search...';
  @Output() search = new EventEmitter<string>();

  keyup(value) {
    this.search.emit(value)
  }

  constructor() { }

  ngOnInit() {
  }

}

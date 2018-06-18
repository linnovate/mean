import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.scss']
})
export class InlineEditComponent implements OnInit {

  @Input() value: string;
  @Input() placeholder: string = 'enter text';
  @Output() valueChange = new EventEmitter<string>();

  resize(el) {
    if(!el) return;
    let input = el.querySelector('input');
    let span = el.querySelector('span');
    span.innerHTML = this.value || this.placeholder;
    let width = getComputedStyle(span).getPropertyValue('width')
    input.style.width = parseFloat(width) + 2 + 'px';
    input.style.marginLeft = '-' + width;
    this.valueChange.emit(this.value);
  }

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    let resize = this.resize.bind(this, this.elementRef.nativeElement.querySelector('.inline-edit'));
    resize()
    window.addEventListener('resize', resize);
  }

  ngOnChanges(changes) {
    this.resize(this.elementRef.nativeElement.querySelector('.inline-edit'))
  }

}

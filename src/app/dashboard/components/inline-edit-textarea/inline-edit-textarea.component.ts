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
  selector: 'app-inline-edit-textarea',
  templateUrl: './inline-edit-textarea.component.html',
  styleUrls: ['./inline-edit-textarea.component.scss']
})
export class InlineEditTextareaComponent implements OnInit {

  @Input() value: string;
  @Input() placeholder: string = 'enter text';
  @Output() valueChange = new EventEmitter<string>();

  autosize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    this.valueChange.emit(this.value);
  }

  ngOnChanges(changes) {
    setTimeout(() => {
      this.autosize(this.elementRef.nativeElement.querySelector('textarea'))
    }, 0)
  }

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

}

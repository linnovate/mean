import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';


@Component({
  selector: 'app-main-section-system',
  templateUrl: './main-section-system.component.html',
  styleUrls: ['./main-section-system.component.scss']
})
export class MainSectionSystemComponent implements OnInit {


  name: string = '';
  platform: any;
  equipment: Array<any>;
  platforms: Array<any> = [];
  system = {
    name: '',
    description: '',
    platform: [],
    equipment: [],
  };

  constructor(private dragulaService: DragulaService) {
    dragulaService.dropModel.subscribe((value) => {
      console.log(this.system);
      // this.system.platform = value.slice(1)[0].lastChild.innerText;
    });
    dragulaService.removeModel.subscribe((value) => {
      console.log(this.system);
      // this.system.platform = value.slice(1)[0].lastChild.innerText;
    });
    dragulaService.setOptions('platform', {
      invalid: this.invalidHandler
    });
   }

   invalidHandler(el, handle) {
    let draggedFromMain = el;
    while ((draggedFromMain = draggedFromMain.parentElement) && !draggedFromMain.classList.contains('main-section'));
    if ((this as any).containers[0].childElementCount === 1 && !draggedFromMain) return true;
    return false;
  }

  ngOnInit() {
  }

}

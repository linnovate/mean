import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { SystemService } from '../services/system.service';


@Component({
  selector: 'app-main-section-system',
  templateUrl: './main-section-system.component.html',
  styleUrls: ['./main-section-system.component.scss']
})
export class MainSectionSystemComponent implements OnInit {


  name: string = '';
  description: string = '';
  platform: any;
  equipment: Array<any>;
  platforms: Array<any> = [];
  system = {
    name: '',
    description: '',
    platform: [],
    equipment: [],
    status: 'draft'
  };
  statuses: string[] = ['draft', 'waiting', 'approved', 'rejected'];
  status: string;
  displayEquipmentPlaceHolder: string = 'flex';

  constructor(private dragulaService: DragulaService, private systemService: SystemService) {

    this.dragulaEvents();
   }

   dragulaEvents() {
    this.dragulaService.dropModel.subscribe((value) => {
      if (value[0] === 'equipment') this.displayEquipmentPlaceHolder = 'none';
      console.log(this.system);
    });
    this.dragulaService.removeModel.subscribe((value) => {
      console.log(this.system);
    });
    this.dragulaService.drag.subscribe((value) => {
      if (value[0] === 'equipment') this.displayEquipmentPlaceHolder = 'flex';
      console.log(value,  'orit');
    });
    this.dragulaService.setOptions('platform', {
      //invalid: this.invalidHandler
    });
   }

   invalidHandler(el, handle) {
    let draggedFromMain = el;
    while ((draggedFromMain = draggedFromMain.parentElement) && !draggedFromMain.classList.contains('main-section'));
    if ((this as any).containers[0].childElementCount === 1 && !draggedFromMain) return true;
    return false;
  }

  removeItem(type, item) {
    this.removeByKey(this.system[type], {
      key: '_id',
      value: item._id
    });
    this.systemService.events.next({
      name: 'item.deleted',
      data: {
        type: type,
        item: item
      }
    })
  }

  removeByKey(array, params){
    array.some(function(item, index) {
      return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
    });
    return array;
  }

  cancel() {}

  save() {
    this.system.name = this.name;
    this.system.description = this.description;
    if (this.valid())
      this.systemService.save(this.system).subscribe(data => {
        console.log('saved system', data);
      });
  }

  valid() {
    if (this.system.platform.length === 1 && this.system.equipment.length > 0) return true;
    return false;
  }

  delete() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.dragulaService.destroy('platform');
  }

}

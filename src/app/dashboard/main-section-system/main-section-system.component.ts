import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  statuses: string[] = ['draft', 'waiting', 'approved', 'rejected'];
  status: string;
  displayEquipmentPlaceHolder: string = 'none';
  system: any = {
    name: '',
    description: '',
    platform: [],
    equipment: [],
    status: 'draft'
  };

  constructor(private dragulaService: DragulaService,
              private systemService: SystemService,
              private router: Router,
              private route: ActivatedRoute) {

    this.dragulaEvents();
   }

   dragulaEvents() {
    this.dragulaService.dropModel.subscribe((value) => {
      if (value[0] === 'equipment') this.displayEquipmentPlaceHolder = 'none';
      if (value[0] === 'platform' && !this.system.equipment.length) this.displayEquipmentPlaceHolder = 'flex';
    });
    this.dragulaService.drag.subscribe((value) => {
      if (value[0] === 'equipment') this.displayEquipmentPlaceHolder = 'flex';
    });
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
    });
    if (!this.system.equipment.length) this.displayEquipmentPlaceHolder = 'flex';
  }

  removeByKey(array, params){
    array.some(function(item, index) {
      return (array[index][params.key] === params.value) ? !!(array.splice(index, 1)) : false;
    });
    return array;
  }

  cancel() {}

  update() {
    this.system.name = this.name;
    this.system.description = this.description;
    if (this.valid())
      this.systemService.update(this.system._id, this.system).subscribe((data: any) => {
        this.router.navigate([`/system/${data._id}`]);
      });
  }

  save() {
    if (this.system._id) return this.update();
    this.system.name = this.name;
    this.system.description = this.description;
    if (this.valid())
      this.systemService.save(this.system).subscribe((data: any) => {
        this.router.navigate([`/system/${data._id}`]);
      });
  }

  valid() {
    return this.system.platform.length === 1 && this.system.equipment.length > 0
  }

  delete() {}

  initExistsSystem(systemId) {
    this.systemService.findOne(systemId).subscribe((system: any) => {
      this.system = system;
      this.system.platform = [system.platform];
      this.name = system.name;
      this.description = system.description;
      this.systemService.events.next({
        name: 'init.exists.system',
        data: this.system
      });
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.systemId) this.initExistsSystem(params.systemId)
    });
  }

  ngOnDestroy() {
    this.dragulaService.destroy('platform');
  }

}

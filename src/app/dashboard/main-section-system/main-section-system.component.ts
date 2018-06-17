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
  system: any;
  statuses: string[] = ['draft', 'waiting', 'approved', 'rejected'];
  status: string;
  displayEquipmentPlaceHolder: string = 'flex';

  constructor(private dragulaService: DragulaService,
              private systemService: SystemService,
              private router: Router,
              private route: ActivatedRoute) {

    this.dragulaEvents();
   }

   dragulaEvents() {
    this.dragulaService.dropModel.subscribe((value) => {
      if (value[0] === 'equipment') this.displayEquipmentPlaceHolder = 'none';
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
    })
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
        console.log('saved system', data);
        this.router.navigate([`/system/${data._id}`]);
      });
  }

  save() {
    if (this.system._id) return this.update();
    this.system.name = this.name;
    this.system.description = this.description;
    if (this.valid())
      this.systemService.save(this.system).subscribe((data: any) => {
        console.log('saved system', data);
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
    })
  }

  initNewSystem() {
    this.system = {
      name: '',
      description: '',
      platform: [],
      equipment: [],
      status: 'draft'
    };
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.systemId) return this.initExistsSystem(params.systemId)
      this.initNewSystem();
    });
  }

  ngOnDestroy() {
    this.dragulaService.destroy('platform');
  }

}

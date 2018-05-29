import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { EntityService } from '../entity/entity.service';


@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {

  private currentModeIndex: Number = 0;

  public schema;
  public json: Object = {};
  public options: Object = {};
  public modes: Array<any> = []
  public entity: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.entityService.findOne(params.entityId).subscribe((entity : any) => {
        this.entity = entity;
        this.schema = entity._schema;
        this.json = entity.modes[0].data;
      })
    });
  }

  addMode() {
    // this.saveMode();
    this.entity.modes.push(JSON.parse(JSON.stringify(this.entity.modes[this.entity.modes.length -1])));
    this.json = this.entity.modes[this.entity.modes.length - 1].data;
    console.log(this.entity, 'ddddddd');
  }

  setCurrentMode(i) {
    this.json = this.entity.modes[i].data;
  }

  save() {
    console.log(this.entity , 'ffffffffff');
    this.entityService.update(this.entity._id, this.entity)
      .subscribe(data => {
        console.log(data, 'schema updated data');
      });
  }

}

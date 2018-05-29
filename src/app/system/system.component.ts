import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EntityService} from '../entity/entity.service';
import {SystemService} from './system.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class NewSystemComponent implements OnInit {

  equipment:Array<any>;

  constructor(
    public dialogRef: MatDialogRef<NewSystemComponent>,
    private entityService: EntityService,
    private systemService: SystemService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.getEquipment();
  }

  getEquipment() {
    this.entityService.find('equipment').subscribe(data => {
      this.equipment = data;
    });
  }

  save(equipment) {
    this.systemService.save({
      platform: this.data.platform._id,
      equipment: equipment.map(i => i.value)
    }).subscribe(res => {
      console.log('save loaded platform data result', res);
      this.dialogRef.close();
    })
  }
}


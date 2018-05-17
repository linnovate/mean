import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {EntityDataService} from '../schema-entities/entity-data.service';
import {LoadedPlatformService} from './loaded-platform.service';

@Component({
  selector: 'app-new-loaded-platform',
  templateUrl: './new-loaded-platform.component.html',
  styleUrls: ['./new-loaded-platform.component.scss']
})
export class NewLoadedPlatformComponent implements OnInit {

  equipment:Array<any>;

  constructor(
    public dialogRef: MatDialogRef<NewLoadedPlatformComponent>,
    private entityDataService: EntityDataService,
    private loadedDataService: LoadedPlatformService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.getEquipment();
  }

  getEquipment() {
    this.entityDataService.find(this.data.equipmentSchemaId).subscribe(data => {
      this.equipment = data;
    });
  }

  save(equipment) {
    this.loadedDataService.save({
      platform: this.data.platform._id,
      equipment: equipment.map(i => i.value)
    }).subscribe(res => {
      console.log('save loaded platform data result', res);
      this.dialogRef.close();
    })
  }
}


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-actions',
  templateUrl: './sidebar-actions.component.html',
  styleUrls: ['./sidebar-actions.component.scss']
})
export class SidebarActionsComponent implements OnInit {

  icons: string[] = [
    'airplane-front-view',
    'air-station',
    'balloon',
    'boat',
    'cargo-ship',
    'car',
    'catamaran',
    'convertible',
    'drone',
    'fighter-plane',
    'fire-truck',
    'horseback-riding',
    'motorcycle',
    'railcar',
    'railroad-train',
    'rocket-boot',
    'sailing-boat',
    'segway',
    'shuttle',
    'space-shuttle',
    'steam-engine',
    'suv',
    'tour-bus',
    'tow-truck',
    'transportation',
    'trolleybus',
    'water-transportation',
    '',
    '',
    '',
    '',
    '',
    ''
  ]; // empty icons are to align last flexbox row to the left

  iconsToDisplay: string[] = this.icons;

  filterIcons(input) {
    this.iconsToDisplay = this.icons.filter(icon => {
      // don't filter out empty icons (`!icon`)
      return !icon || icon.includes(input.value);
    })
  }

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sidebar-entities',
  templateUrl: './sidebar-entities.component.html',
  styleUrls: ['./sidebar-entities.component.scss']
})
export class SidebarEntitiesComponent implements OnInit {

  public tabs = [{
    label: 'SYSTEMS',
    link: 'system'
  },{
    label: 'PLATFORMS',
    link: 'platform'
  },{
    label: 'EQUIPMENT',
    link: 'equipment'
  }];
  
  public activeTab: string;

  constructor(
    private location: Location,
  ) { }

  selectedTabChangeHandler(tab) {
    const activeTab = this.tabs[tab.index].link;
    this.location.replaceState(activeTab);
    this.activeTab = activeTab;
  }

  ngOnInit() {
  }

}

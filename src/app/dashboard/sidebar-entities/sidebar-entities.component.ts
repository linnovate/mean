import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-sidebar-entities',
  templateUrl: './sidebar-entities.component.html',
  styleUrls: ['./sidebar-entities.component.scss']
})
export class SidebarEntitiesComponent implements OnInit {

  public tabs = [{
    label: 'SYSTEMS',
    link: 'system',
    active: false
  },{
    label: 'PLATFORMS',
    link: 'platform',
    active: true
  },{
    label: 'EQUIPMENT',
    link: 'equipment',
    active: false
  }];
  
  public activeTab: string = 'platform';
  public selectedIndex = 1;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  selectedTabChangeHandler(tab) {
    const activeTab = this.tabs[tab.index].link;
    this.location.replaceState(activeTab);
    this.activeTab = activeTab;
  }

  ngOnInit() {
  }
}

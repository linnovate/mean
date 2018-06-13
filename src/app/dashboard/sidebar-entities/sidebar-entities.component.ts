import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
    link: 'system'
  },{
    label: 'PLATFORMS',
    link: 'platform'
  },{
    label: 'EQUIPMENT',
    link: 'equipment'
  }];
  
  public selectedIndex = 1;
  public activeTab;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.activeTab = this.location.path().split('/')[1];
    this.selectedIndex = this.tabs.findIndex(elem => elem.link === this.activeTab);
  }

  selectedTabChangeHandler(tab) {
    const activeTab = this.tabs[tab.index].link;
    this.router.navigate([this.tabs[tab.index].link])
    this.activeTab = activeTab;
  }

  ngOnInit() {
  }
}

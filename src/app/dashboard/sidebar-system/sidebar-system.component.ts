import { Component, OnInit, OnDestroy } from '@angular/core';
import { SchemaService } from '../services/schema.service';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-sidebar-system',
  templateUrl: './sidebar-system.component.html',
  styleUrls: ['./sidebar-system.component.scss']
})
export class SidebarSystemComponent implements OnInit {

  data: any = {};
  showPlatform: Boolean = true;

  constructor(
    private schemaService: SchemaService,
    private dragulaService: DragulaService) {
      
      ['platform', 'equipment'].forEach(type => {
        this.schemaService.tree(type, 'name').subscribe(data => {
          data.map(category => {
            category.children.map(child => {
              child.category = category.name;
              return child;
            });
            return category;
          });
          this.data[type] = data
        });
      });

    dragulaService.dragend.subscribe((value) => {
      if (value[0] === 'platform') this.showPlatform = false;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    
    // this.dragulaService.destroy('platform');
  }

}

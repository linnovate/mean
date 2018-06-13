import { Component, OnInit } from '@angular/core';
import { SchemaService } from '../../schema/schema.service';

@Component({
  selector: 'app-system-sidebar',
  templateUrl: './system-sidebar.component.html',
  styleUrls: ['./system-sidebar.component.scss']
})
export class SystemSidebarComponent implements OnInit {

  data: any = {};

  constructor(private schemaService: SchemaService) {
    this.schemaService.tree('platform', 'name').subscribe(data => this.data.platforms = data);
    this.schemaService.tree('equipment', 'name').subscribe(data => this.data.equipment = data);
  }

  ngOnInit() {
  }

}

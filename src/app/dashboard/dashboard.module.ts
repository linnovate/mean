import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Modules */
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

/* Components */
import { DashboardComponent } from './dashboard.component';
import { SidebarEntitiesComponent } from './sidebar-entities/sidebar-entities.component';
import { SidebarActionsComponent } from './sidebar-actions/sidebar-actions.component';

/* Services */
import { SchemaService } from '../schema/schema.service';
import { TreeComponent } from './sidebar-entities/tree/tree.component';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
  ],
  declarations: [DashboardComponent, SidebarEntitiesComponent, SidebarActionsComponent, TreeComponent],
  providers: [SchemaService]
})
export class DashboardModule { }

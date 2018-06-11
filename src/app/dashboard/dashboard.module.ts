import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';

/* Modules */
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

/* Components */
import { DashboardComponent } from './dashboard.component';
import { MainSectionEntityComponent } from './main-section-entity/main-section-entity.component';
import { SidebarEntitiesComponent } from './sidebar-entities/sidebar-entities.component';
import { SidebarActionsComponent } from './sidebar-actions/sidebar-actions.component';
import { EntitiesTreeComponent } from './sidebar-entities/tree/tree.component';

/* Services */
import { EntityService } from '../entity/entity.service';
import { SchemaService } from '../schema/schema.service';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    TreeModule,
  ],
  declarations: [
    DashboardComponent,
    MainSectionEntityComponent,
    SidebarEntitiesComponent,
    SidebarActionsComponent,
    EntitiesTreeComponent,
  ],
  providers: [
    EntityService,
    SchemaService,
  ]
})
export class DashboardModule { }

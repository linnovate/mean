import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';
import { DragulaModule } from 'ng2-dragula';

/* Modules */
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

/* Components */
import { DashboardComponent } from './dashboard.component';
import { MainSectionEntityComponent } from './main-section-entity/main-section-entity.component';
import { MainSectionSystemComponent } from './main-section-system/main-section-system.component';
import { SidebarEntitiesComponent } from './sidebar-entities/sidebar-entities.component';
import { SidebarActionsComponent } from './sidebar-actions/sidebar-actions.component';
import { EntitiesTreeComponent } from './sidebar-entities/tree/tree.component';
import { InlineEditComponent } from '../inline-edit/inline-edit.component';
import { SidebarSystemComponent } from './sidebar-system/sidebar-system.component';

/* Services */
import { EntityService } from './services/entity.service';
import { SchemaService } from './services/schema.service';

/* Pipes */
import { ReplacePipe } from 'angular-pipes';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    TreeModule,
    DragulaModule,
  ],
  declarations: [
    DashboardComponent,
    MainSectionEntityComponent,
    MainSectionSystemComponent,
    SidebarEntitiesComponent,
    SidebarActionsComponent,
    EntitiesTreeComponent,
    InlineEditComponent,
    SidebarSystemComponent,
    ReplacePipe,
  ],
  providers: [
    EntityService,
    SchemaService,
  ]
})
export class DashboardModule { }

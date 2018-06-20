import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';
import { DragulaModule } from 'ng2-dragula';

/* Modules */
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgStringPipesModule } from 'angular-pipes';

/* Components */
import { DashboardComponent } from './dashboard.component';
import { MainSectionEntityComponent } from './main-section-entity/main-section-entity.component';
import { MainSectionSystemComponent } from './main-section-system/main-section-system.component';
import { SidebarEntitiesComponent } from './sidebar-entities/sidebar-entities.component';
import { EntitiesTreeComponent } from './sidebar-entities/tree/tree.component';
import { SidebarSystemComponent } from './sidebar-system/sidebar-system.component';
import { ToggleCaseComponent } from './components/toggle-case/toggle-case.component';
import { IconsBarComponent } from './components/icons-bar/icons-bar.component';

import {
  DynamicFormModule,
  InlineEditComponent,
  InlineEditTextareaComponent,
  SearchBoxComponent
} from './components';

/* Services */
import { EntityService } from './services/entity.service';
import { SchemaService } from './services/schema.service';

/* Pipes */
import { FilterDragulaListPipe } from './pipes/filter-dragula-list.pipe';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    TreeModule,
    DragulaModule,
    DynamicFormModule,
    NgStringPipesModule,
  ],
  declarations: [
    DashboardComponent,
    MainSectionEntityComponent,
    MainSectionSystemComponent,
    SidebarEntitiesComponent,
    EntitiesTreeComponent,
    InlineEditComponent,
    SidebarSystemComponent,
    InlineEditTextareaComponent,
    SearchBoxComponent,
    FilterDragulaListPipe,
    ToggleCaseComponent,
    IconsBarComponent,
  ],
  providers: [
    EntityService,
    SchemaService,
  ]
})
export class DashboardModule { }

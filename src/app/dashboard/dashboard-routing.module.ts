import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { MainSectionEntityComponent } from '../dashboard/main-section-entity/main-section-entity.component';
import { MainSectionSystemComponent } from '../dashboard/main-section-system/main-section-system.component';
import { SidebarActionsComponent } from '../dashboard/sidebar-actions/sidebar-actions.component';

export function entities(url: UrlSegment[]) {
  return url.length === 1 && ['platform', 'equipment'].indexOf(url[0].path) > -1 ? ({ consumed: url }) : null;
}

const routes: Routes = [{
  // matcher: entities,
  path: ':type',
  component: DashboardComponent,
  children: [{
    path: 'new/:category',
    component: MainSectionEntityComponent
  }, {
    path: ':entityId/new',
    component: MainSectionEntityComponent
  },{
    path: ':entityId/:modeName',
    component: MainSectionEntityComponent
  }, {
    path: ':entityId/:modeName',
    component: SidebarActionsComponent,
    outlet: 'sidebar'
  }]}, {
  path: 'system',
  component: DashboardComponent,
  children: [{
    path: '',
    component: MainSectionSystemComponent
  }, {
    path: '',
    component: SidebarActionsComponent,
    outlet: 'sidebar'
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

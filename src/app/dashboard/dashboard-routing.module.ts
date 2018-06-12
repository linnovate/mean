import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { MainSectionEntityComponent } from '../dashboard/main-section-entity/main-section-entity.component';

const routes: Routes = [{
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
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

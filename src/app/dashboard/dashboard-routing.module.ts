import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { MainSectionEntityComponent } from '../dashboard/main-section-entity/main-section-entity.component';
import { MainSectionSystemComponent } from '../dashboard/main-section-system/main-section-system.component';

import { AuthGuard } from '../auth/auth-guard.service';

const routes : Routes = [{
  path: '',
  redirectTo: '/system',
  pathMatch: 'full'
}, {
  path: 'system',
  canActivate: [AuthGuard],
  component: DashboardComponent,
  children: [{
    path: 'new',
    component: MainSectionSystemComponent
  }, {
    path: ':systemId',
    component: MainSectionSystemComponent
  }]
}, {
  path: ':type',
  component: DashboardComponent,
  canActivate: [AuthGuard],
  children: [{
    path: 'new/:category',
    component: MainSectionEntityComponent
  }, {
    path: ':entityId/new',
    component: MainSectionEntityComponent
  }, {
    path: ':entityId/:modeName',
    component: MainSectionEntityComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {}

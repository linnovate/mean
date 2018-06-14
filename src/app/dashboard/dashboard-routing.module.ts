import {NgModule} from '@angular/core';
import {Routes, RouterModule, UrlSegment} from '@angular/router';

import {DashboardComponent} from './dashboard.component';
import {MainSectionEntityComponent} from '../dashboard/main-section-entity/main-section-entity.component';
import {MainSectionSystemComponent} from '../dashboard/main-section-system/main-section-system.component';

const routes : Routes = [
  {
    path: 'system',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: MainSectionSystemComponent
      },
      {
        path: 'new',
        component: MainSectionSystemComponent
      }
    ]
  }, {
    path: ':type',
    component: DashboardComponent,
    children: [
      {
        path: 'new/:category',
        component: MainSectionEntityComponent
      }, {
        path: ':entityId/new',
        component: MainSectionEntityComponent
      }, {
        path: ':entityId/:modeName',
        component: MainSectionEntityComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
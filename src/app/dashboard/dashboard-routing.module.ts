import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { TreeComponent } from './sidebar-entities/tree/tree.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  children: [{
    path: ':schema',
    // component: TreeComponent,
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

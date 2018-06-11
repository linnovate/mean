import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SchemaComponent} from '../schema/schema.component';
import {OnlyAdminUsersGuard} from '../admin/admin-user-guard';

const routes : Routes = [
  {
    path: '',
    loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
  }, {
    path: 'upload/schema',
    component: SchemaComponent,
    // canActivate: [OnlyAdminUsersGuard]
  }, {
    path: 'auth',
    loadChildren: 'app/auth/auth.module#AuthModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
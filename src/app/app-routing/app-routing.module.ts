import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component'
import {LoginComponent} from '../auth/login/login.component'
import {RegisterComponent} from '../auth/register/register.component'
import {AdminComponent} from '../admin/admin.component';
import {OnlyAdminUsersGuard} from '../admin/admin-user-guard';

const routes : Routes = [
  {
    path: '',
    component: DynamicFormComponent
  }, {
    path: 'dynamic-form',
    component: DynamicFormComponent
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'register',
    component: RegisterComponent
  }, {
     path: 'admin', component: AdminComponent, canActivate: [OnlyAdminUsersGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
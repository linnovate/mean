import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../auth/login/login.component';
import {RegisterComponent} from '../auth/register/register.component';
import {SchemaComponent} from '../schema/schema.component';
import {AdminComponent} from '../admin/admin.component';
import {OnlyAdminUsersGuard} from '../admin/admin-user-guard';

const routes : Routes = [
  {
    path: '',
    component: HomeComponent
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
     path: 'admin', component: AdminComponent, canActivate: [OnlyAdminUsersGuard]
  }, {
    path: 'schemas',
    component: SchemaComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
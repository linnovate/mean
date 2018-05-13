import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component'
import {LoginComponent} from '../auth/login/login.component'
import {RegisterComponent} from '../auth/register/register.component'


const routes : Routes = [
  {
    path: '',
    component: DynamicFormComponent
  },
  {
    path: 'dynamic-form',
    component: DynamicFormComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
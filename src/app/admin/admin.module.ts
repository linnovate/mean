import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {AdminComponent} from './admin.component';
import {OnlyAdminUsersGuard} from './admin-user-guard';

/*
      Don't leave side-effects outside of classes so this will tree-shake nicely on prod
      e.g. `console.log('something')` is a side effect.
*/
@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    OnlyAdminUsersGuard
  ]})
export class AdminModule {
  constructor() {
    console.log('`AdminModule` module initialized');
  }
}

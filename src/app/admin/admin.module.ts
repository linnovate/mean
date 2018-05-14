import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {AdminComponent} from './admin.component';
import {OnlyAdminUsersGuard} from './admin-user-guard';
import {DynamicFormModule} from '../dynamic-form'

import {MatTabsModule } from '@angular/material';

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
    MatTabsModule,
    DynamicFormModule
  ]})
export class AdminModule {
  constructor() {
    console.log('`AdminModule` module initialized');
  }
}
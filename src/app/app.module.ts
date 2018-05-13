import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {
  MatToolbarModule,
  MatMenuModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { DynamicFormModule } from './dynamic-form';
import { AuthModule } from './auth';

import { AppRoutingModule } from './app-routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    DynamicFormModule,
    AuthModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

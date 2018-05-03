import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DynamicFormModule } from './dynamic-form';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DynamicFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

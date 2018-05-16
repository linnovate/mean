import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatTabsModule,
  MatButtonModule
 } from '@angular/material';

import { DynamicFormComponent } from './dynamic-form.component';
import { SchemaService } from '../schema/schema.service';
import { EntityDataService } from '../schema-entities/entity-data.service';


@NgModule({
  declarations: [
    DynamicFormComponent
  ],
  imports: [
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule
  ],
  exports: [
    DynamicFormComponent
  ],
  providers: [
    SchemaService,
    EntityDataService
  ]
})
export class DynamicFormModule { }

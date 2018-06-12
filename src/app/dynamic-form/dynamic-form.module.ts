import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTabsModule,
} from '@angular/material';

import { DynamicFormComponent } from './dynamic-form.component';

@NgModule({
  declarations: [
    DynamicFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule
  ],
  exports: [
    DynamicFormComponent
  ],
  providers: [
  ]
})
export class DynamicFormModule { }

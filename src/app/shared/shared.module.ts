import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const SHARED_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  FlexLayoutModule,
  MatMenuModule,
  MatTabsModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatTreeModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatButtonModule,
  MatDividerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatProgressBarModule
];

@NgModule({
  imports: SHARED_MODULES,
  exports: SHARED_MODULES
})
export class SharedModule {}

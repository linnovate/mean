import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';

import { UploadService } from './upload.service';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  declarations: [DialogComponent],
  entryComponents: [DialogComponent],
  providers: [UploadService]
})
export class UploadModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UploadComponent } from './upload.component';
import { MatButtonModule, MatDialogModule, MatListModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { UploadService } from './upload.service';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule
  ],
  declarations: [/*UploadComponent,*/ DialogComponent],
  // exports: [UploadComponent],
  entryComponents: [DialogComponent],
  providers: [UploadService]
})
export class UploadModule {}
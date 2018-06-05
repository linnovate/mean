import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { DynamicFormModule } from './dynamic-form';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { AuthHeaderInterceptor } from './header-interceptor';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { SchemaComponent } from './schema/schema.component';
import { HeaderComponent } from './header/header.component';
import { NewSystemComponent } from './system/system.component';

import { EntityService } from './entity/entity.service';
import { SystemService } from './system/system.service';
import { EntityComponent } from './entity/entity.component';

@NgModule({
  declarations: [
    AppComponent,
    SchemaComponent,
    HeaderComponent,
    NewSystemComponent,
    EntityComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    AuthModule,
    DynamicFormModule,
    AppRoutingModule,
    AdminModule,
    UploadModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHeaderInterceptor,
    multi: true,
  },
  SystemService,
  EntityService],
  entryComponents: [NewSystemComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

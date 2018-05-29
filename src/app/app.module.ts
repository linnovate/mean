import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DynamicFormModule } from './dynamic-form';
import { AuthModule } from './auth';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { AuthHeaderInterceptor } from './header-interceptor';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { SchemaComponent } from './schema/schema.component';
import { HeaderComponent } from './header/header.component';
import { SchemaEntitiesComponent } from './schema-entities/schema-entities.component';
import { NewSchemaEntityComponent } from './new-schema-entity/new-schema-entity.component';
import { NewSystemComponent } from './system/system.component';

import { SchemaService } from './schema/schema.service';
import { EntityService } from './entity/entity.service';
import { SystemService } from './system/system.service';
import { EntityComponent } from './entity/entity.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SchemaComponent,
    HeaderComponent,
    SchemaEntitiesComponent,
    NewSchemaEntityComponent,
    NewSystemComponent,
    EntityComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    DynamicFormModule,
    AuthModule,
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
  SchemaService,
  EntityService],
  entryComponents: [NewSchemaEntityComponent, NewSystemComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

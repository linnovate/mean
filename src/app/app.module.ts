import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  MatToolbarModule,
  MatMenuModule,
  MatTabsModule,
  MatDividerModule,
  MatCardModule,
  MatListModule,
  MatExpansionModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DynamicFormModule } from './dynamic-form';
import { AuthModule } from './auth';
import { AdminModule } from './admin/admin.module';
import { AddHeaderInterceptor } from './header-interceptor';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { SchemaComponent } from './schema/schema.component';
import { HeaderComponent } from './header/header.component';
import { SchemaEntitiesComponent } from './schema-entities/schema-entities.component';
import { NewSchemaEntityComponent } from './new-schema-entity/new-schema-entity.component';
import { NewLoadedPlatformComponent } from './new-loaded-platform/new-loaded-platform.component';

import { LoadedPlatformService } from './new-loaded-platform/loaded-platform.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SchemaComponent,
    HeaderComponent,
    SchemaEntitiesComponent,
    NewSchemaEntityComponent,
    NewLoadedPlatformComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatDividerModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DynamicFormModule,
    AuthModule,
    AppRoutingModule,
    AdminModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AddHeaderInterceptor,
    multi: true,
  },
  LoadedPlatformService],
  entryComponents: [NewSchemaEntityComponent, NewLoadedPlatformComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

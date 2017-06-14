import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule }  from '@angular/http';
import { MaterialModule } from '@angular/material';

import { routes } from './posts.routes';
import { PostsComponent } from './posts.component';
import { PostsService } from './shared/posts.service';
import { PostFormComponent } from './post-form';


@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    PostsComponent,
    PostFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    RouterModule,
    HttpModule,
    MaterialModule
  ],
  providers: [
    PostsService
  ]
})
export class PostsModule {
  public static routes = routes;
}
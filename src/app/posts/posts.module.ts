import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule }  from '@angular/http';
import { MaterialModule } from '@angular/material';
// import { ApolloModule } from 'apollo-angular';
// import { client } from '../../graphql.client';

import { routes } from './posts.routes';
import { PostsComponent } from './posts.component';
import { PostsService } from './shared/posts.service';
import { PostFormComponent } from './post-form';
import { NewPostComponent } from './new-post/new-post.component';
import {PostsFilterPipe} from './posts-filter.pipe'

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    PostsComponent,
    PostFormComponent,
    NewPostComponent,
    PostsFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    RouterModule,
    HttpModule,
    MaterialModule,
    // ApolloModule.forRoot(client)
  ],
  providers: [
    PostsService
  ]
})
export class PostsModule {
  public static routes = routes;
}
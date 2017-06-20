import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule }  from '@angular/http';
import { MaterialModule } from '@angular/material';

import { routes } from './posts.routes';
import { PostsComponent } from './posts.component';
import { postDetailComponent } from './post-detail/post-detail.component';
import { NewPostComponent } from './new-post/new-post.component';
import {PostsFilterPipe} from './posts-filter/posts-filter.pipe'

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    PostsComponent,
    NewPostComponent,
    PostsFilterPipe,
    postDetailComponent,
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
})
export class PostsModule {
  public static routes = routes;
}
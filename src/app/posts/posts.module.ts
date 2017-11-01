import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule }  from '@angular/http';
import {
  MatCardModule,
  MatListModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule
 } from '@angular/material';

import { routes } from './posts.routes';
import { PostListComponent } from './post-list/post-list.component';
import { postDetailComponent } from './post-detail/post-detail.component';
import { NewPostComponent } from './new-post/new-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import {PostsFilterPipe} from './posts-filter/posts-filter.pipe'

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    PostListComponent,
    NewPostComponent,
    EditPostComponent,
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
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
    // ApolloModule.forRoot(client)
  ],
})
export class PostsModule {
  public static routes = routes;
}

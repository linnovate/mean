import { PostListComponent } from './post-list/post-list.component';
import { NewPostComponent } from './new-post/new-post.component';


export const routes = [
  { path: '', children: [
    { path: '', component: PostListComponent },
    // { path: 'new', component: PostFormComponent }
    { path: 'new', component: NewPostComponent }
  ]},
];
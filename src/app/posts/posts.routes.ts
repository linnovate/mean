import { PostsComponent } from './posts.component';
import { PostFormComponent } from './post-form';
import { NewPostComponent } from './new-post/new-post.component';


export const routes = [
  { path: '', children: [
    { path: '', component: PostsComponent },
    // { path: 'new', component: PostFormComponent }
    { path: 'new', component: NewPostComponent }
  ]},
];
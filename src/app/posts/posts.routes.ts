import { PostsComponent } from './posts.component';
import { PostFormComponent } from './post-form';

export const routes = [
  { path: '', children: [
    { path: '', component: PostsComponent },
    { path: 'new', component: PostFormComponent }
  ]},
];
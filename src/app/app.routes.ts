import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { PostsComponent } from './posts';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'posts', component: PostsComponent },
  { path: '**',    component: NoContentComponent },
];

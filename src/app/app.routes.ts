import { Routes } from '@angular/router';
import { HomeComponent } from './home';
//import { ProfileComponent } from './profile';
import { angularProfileCard } from '../../components/main-profile/index';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'posts', loadChildren: './posts#PostsModule' },
  { path: 'profile', component: angularProfileCard },
  { path: '**',    component: NoContentComponent },
];

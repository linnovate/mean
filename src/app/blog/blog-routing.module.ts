import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../shared/guards';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogFormComponent } from './components/blog-form/blog-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';

const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
  },
  {
    path: 'create',
    component: BlogFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    component: CategoryListComponent,
  },
  {
    path: 'category/:slug',
    component: BlogListComponent,
  },
  {
    path: 'tag/:tag',
    component: BlogListComponent,
  },
  {
    path: 'search',
    component: BlogListComponent,
  },
  {
    path: 'edit/:id',
    component: BlogFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':slug',
    component: BlogDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {}

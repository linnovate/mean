import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';

// Components
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogFormComponent } from './components/blog-form/blog-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BlogFiltersComponent } from './components/blog-filters/blog-filters.component';
import { BlogSearchComponent } from './components/blog-search/blog-search.component';

@NgModule({
  declarations: [
    BlogListComponent,
    BlogDetailComponent,
    BlogFormComponent,
    CategoryListComponent,
    CategoryFormComponent,
    CommentListComponent,
    CommentFormComponent,
    BlogCardComponent,
    BlogFiltersComponent,
    BlogSearchComponent,
  ],
  imports: [CommonModule, SharedModule, BlogRoutingModule],
  exports: [BlogCardComponent, BlogSearchComponent],
})
export class BlogModule {}

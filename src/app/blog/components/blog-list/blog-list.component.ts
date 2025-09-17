import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, map, startWith, tap, catchError } from 'rxjs/operators';

import { Blog, BlogFilters, PaginationResponse } from '@app/shared/interfaces';
import {
  BlogService,
  CategoryService,
  AuthService,
} from '@app/shared/services';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  blogs$!: any;
  loading$ = new BehaviorSubject<boolean>(false);

  filters$ = new BehaviorSubject<BlogFilters>({
    page: 1,
    limit: 10,
    sort: 'newest',
  });

  currentPage = 1;
  pageTitle = 'Blog Posts';

  Math = Math;

  constructor(
    private blogService: BlogService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading$.next(true);

    this.blogService.getBlogs({}).subscribe({
      next: response => {
        this.blogs$ = response;
        this.loading$.next(false);
      },
      error: error => {
        console.error('BlogListComponent: Error fetching blogs:', error);
      },
    });
  }

  private buildFilters(
    currentFilters: BlogFilters,
    params: any,
    queryParams: any
  ): BlogFilters {
    const newFilters: BlogFilters = { ...currentFilters };

    if (params['slug']) {
      newFilters.category = params['slug'];
      this.pageTitle = `Category: ${params['slug']}`;
    } else if (params['tag']) {
      newFilters.tag = params['tag'];
      this.pageTitle = `Tag: ${params['tag']}`;
    } else if (queryParams['q']) {
      this.pageTitle = `Search: ${queryParams['q']}`;
    } else {
      this.pageTitle = 'Blog Posts';
    }

    if (queryParams['page']) newFilters.page = parseInt(queryParams['page']);
    if (queryParams['limit']) newFilters.limit = parseInt(queryParams['limit']);
    if (queryParams['sort']) newFilters.sort = queryParams['sort'];
    if (queryParams['status']) newFilters.status = queryParams['status'];

    return newFilters;
  }

  private fetchBlogs(
    filters: BlogFilters
  ): Observable<PaginationResponse<Blog>> {
    this.loading$.next(true);

    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    let apiCall: Observable<PaginationResponse<Blog>>;

    if (params['slug']) {
      apiCall = this.blogService.getBlogsByCategory(params['slug'], filters);
    } else if (params['tag']) {
      apiCall = this.blogService.getBlogsByTag(params['tag'], filters);
    } else if (queryParams['q']) {
      apiCall = this.blogService.searchBlogs(queryParams['q'], filters);
    } else {
      apiCall = this.blogService.getBlogs(filters);
    }

    return apiCall.pipe(
      tap((response: any) => {
        this.loading$.next(false);
      }),
      catchError((error: any) => {
        console.error('BlogListComponent: Error in Observable chain:', error);
        this.loading$.next(false);
        return of({
          blogs: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        });
      })
    );
  }

  onFiltersChange(newFilters: BlogFilters): void {
    const updatedFilters = { ...this.filters$.value, ...newFilters, page: 1 };
    this.filters$.next(updatedFilters);
    this.updateUrl(updatedFilters);
  }

  onPageChange(page: number): void {
    const updatedFilters = { ...this.filters$.value, page };
    this.filters$.next(updatedFilters);
    this.updateUrl(updatedFilters);
  }

  private updateUrl(filters: BlogFilters): void {
    const queryParams: any = {};

    if (filters.page && filters.page > 1) queryParams.page = filters.page;
    if (filters.limit && filters.limit !== 10)
      queryParams.limit = filters.limit;
    if (filters.sort && filters.sort !== 'newest')
      queryParams.sort = filters.sort;
    if (filters.status) queryParams.status = filters.status;
    queryParams.category = filters.category;

    this.blogService.getBlogs(queryParams).subscribe({
      next: response => {
        this.blogs$ = response;
        this.loading$.next(false);
      },
      error: error => {
        console.error('BlogListComponent: Error fetching blogs:', error);
      },
    });
  }

  trackByBlog(index: number, blog: Blog): string {
    return blog._id;
  }
}

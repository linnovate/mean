import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/interfaces/blog.interface';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  blog: Blog | null = null;
  isLoading = true;
  isLiking = false;
  canEdit = false; // TODO: Implement based on user permissions

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadBlog(slug);
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBlog(slug: string): void {
    this.blogService
      .getBlogBySlug(slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: blog => {
          this.blog = blog;
          this.isLoading = false;
          // TODO: Check if current user can edit this blog
        },
        error: (error: any) => {
          console.error('Error loading blog:', error);
          this.isLoading = false;
        },
      });
  }

  likeBlog(): void {
    if (!this.blog || this.isLiking) return;

    this.isLiking = true;
    this.blogService
      .toggleLike(this.blog._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          if (this.blog) {
            const likes = result?.likes ?? this.blog.likes;
            this.blog = { ...this.blog, likes };
          }
          this.isLiking = false;
        },
        error: (error: any) => {
          console.error('Error liking blog:', error);
          this.isLiking = false;
        },
      });
  }

  editBlog(): void {
    if (this.blog) {
      this.router.navigate(['/blog/edit', this.blog._id]);
    }
  }

  deleteBlog(): void {
    if (!this.blog) return;

    const confirmed = confirm(
      'Are you sure you want to delete this blog post?'
    );
    if (confirmed) {
      this.blogService
        .deleteBlog(this.blog._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/blog']);
          },
          error: (error: any) => {
            console.error('Error deleting blog:', error);
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }
}

import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from '@app/shared/interfaces';
import { BlogService } from '@app/shared/services';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
})
export class BlogCardComponent {
  @Input() blog!: Blog;

  constructor(private blogService: BlogService, private router: Router) {}

  onCardClick(): void {
    // Increment views and navigate
    this.blogService.incrementViews(this.blog._id).subscribe();
    this.router.navigate(['/blog', this.blog.slug]);
  }

  onCategoryClick(event: Event, categorySlug: string): void {
    event.stopPropagation();
    this.router.navigate(['/blog/category', categorySlug]);
  }

  onTagClick(event: Event, tag: string): void {
    event.stopPropagation();
    this.router.navigate(['/blog/tag', tag]);
  }

  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

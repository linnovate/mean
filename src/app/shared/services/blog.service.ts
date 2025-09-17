import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Blog,
  BlogFilters,
  PaginationResponse,
  ApiResponse,
} from '@app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = '/api/blogs';

  constructor(private http: HttpClient) {}

  // Get all blogs with filters
  getBlogs(filters: BlogFilters = {}): Observable<PaginationResponse<Blog>> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginationResponse<Blog>>(this.apiUrl, { params });
  }

  // Get published blogs
  getPublishedBlogs(
    filters: BlogFilters = {}
  ): Observable<PaginationResponse<Blog>> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginationResponse<Blog>>(`${this.apiUrl}/published`, {
      params,
    });
  }

  // Get featured blogs
  getFeaturedBlogs(limit = 5): Observable<Blog[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Blog[]>(`${this.apiUrl}/featured`, { params });
  }

  // Get blog by ID
  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  // Get blog by slug
  getBlogBySlug(slug: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/slug/${slug}`);
  }

  // Get blogs by category
  getBlogsByCategory(
    categorySlug: string,
    filters: BlogFilters = {}
  ): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.apiUrl}/category/${categorySlug}`, {
      params,
    });
  }

  // Get blogs by tag
  getBlogsByTag(tag: string, filters: BlogFilters = {}): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.apiUrl}/tag/${tag}`, { params });
  }

  // Create blog
  createBlog(blog: Partial<Blog>): Observable<ApiResponse<Blog>> {
    return this.http.post<ApiResponse<Blog>>(this.apiUrl, blog);
  }

  // Update blog
  updateBlog(id: string, blog: Partial<Blog>): Observable<ApiResponse<Blog>> {
    return this.http.put<ApiResponse<Blog>>(`${this.apiUrl}/${id}`, blog);
  }

  // Delete blog
  deleteBlog(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Toggle like
  toggleLike(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/like`, {});
  }

  // Increment views
  incrementViews(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/views`, {});
  }

  // Search blogs
  searchBlogs(query: string, filters: BlogFilters = {}): Observable<any> {
    let params = new HttpParams().set('q', query);

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  // Get user's drafts
  getDrafts(filters: BlogFilters = {}): Observable<PaginationResponse<Blog>> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginationResponse<Blog>>(`${this.apiUrl}/drafts`, {
      params,
    });
  }

  // Get scheduled blogs
  getScheduledBlogs(
    filters: BlogFilters = {}
  ): Observable<PaginationResponse<Blog>> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginationResponse<Blog>>(
      `${this.apiUrl}/scheduled/all`,
      { params }
    );
  }

  // Publish blog
  publishBlog(id: string): Observable<ApiResponse<Blog>> {
    return this.http.post<ApiResponse<Blog>>(
      `${this.apiUrl}/${id}/publish`,
      {}
    );
  }

  // Schedule blog
  scheduleBlog(id: string, scheduledAt: Date): Observable<ApiResponse<Blog>> {
    return this.http.post<ApiResponse<Blog>>(`${this.apiUrl}/${id}/schedule`, {
      scheduledAt,
    });
  }
}

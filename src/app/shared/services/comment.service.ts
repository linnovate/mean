import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Comment,
  PaginationResponse,
  ApiResponse,
} from '@app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = '/api/comments';

  constructor(private http: HttpClient) {}

  // Get comments for a blog
  getCommentsByBlog(
    blogId: string,
    filters: any = {}
  ): Observable<PaginationResponse<Comment>> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginationResponse<Comment>>(
      `${this.apiUrl}/blog/${blogId}`,
      { params }
    );
  }

  // Get comment by ID
  getCommentById(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }

  // Create comment
  createComment(comment: Partial<Comment>): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(this.apiUrl, comment);
  }

  // Update comment
  updateComment(id: string, content: string): Observable<ApiResponse<Comment>> {
    return this.http.put<ApiResponse<Comment>>(`${this.apiUrl}/${id}`, {
      content,
    });
  }

  // Delete comment
  deleteComment(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Toggle like
  toggleLike(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/like`, {});
  }

  // Moderate comment (admin only)
  moderateComment(
    id: string,
    status: 'approved' | 'rejected',
    reason?: string
  ): Observable<ApiResponse<Comment>> {
    const body: any = { status };
    if (reason) {
      body.moderationReason = reason;
    }
    return this.http.post<ApiResponse<Comment>>(
      `${this.apiUrl}/${id}/moderate`,
      body
    );
  }

  // Get pending comments (admin only)
  getPendingComments(
    filters: any = {}
  ): Observable<PaginationResponse<Comment>> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginationResponse<Comment>>(
      `${this.apiUrl}/pending`,
      { params }
    );
  }

  // Get comments by user
  getCommentsByUser(
    userId: string,
    filters: any = {}
  ): Observable<PaginationResponse<Comment>> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginationResponse<Comment>>(
      `${this.apiUrl}/user/${userId}`,
      { params }
    );
  }
}

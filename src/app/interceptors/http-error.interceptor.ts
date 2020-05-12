import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(this.showSnackBar));
  }

  private showSnackBar = (response: HttpErrorResponse): Observable<never> => {
    const text: string | undefined = response.error?.message ?? response.error.statusText;

    if (text) {
      this.snackBar.open(text, 'Close', {
        duration: 2000,
      });
    }

    return throwError(response);
  };
}

import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/do';

export class CatchErrorInterceptor implements HttpInterceptor {
  intercept(request : HttpRequest < any >, next : HttpHandler) : Observable < HttpEvent < any >> {

    return next
      .handle(request)
      .do 
        ((event : HttpEvent < any >) => {}, (err : any) => {
          if (err instanceof HttpErrorResponse) {
            let text = (err.error && err.error.message) ? err.error.message : err.statusText;
            (<any>window).globalEvents.emit('open error dialog', text);
          }
        });

      }
  }
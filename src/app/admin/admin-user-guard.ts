import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OnlyAdminUsersGuard implements CanActivate {
  constructor(private authService : AuthService) {};

  canActivate() {
    return new Observable<boolean> (observer => {
      this
        .authService
        .getUser()
        .subscribe(user => {
          if (!user) observer.next(false);
          observer.next(user.isAdmin)
        })
    });
  }
}
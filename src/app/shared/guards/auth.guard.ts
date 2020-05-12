import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUser().pipe(
      map(user => {
        if (user !== null) {
          return true;
        }

        this.router.navigateByUrl('/auth/login');
        return false;
      })
    );
  }
}

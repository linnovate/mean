import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard /* implements CanActivate (optional now) */ {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    return this.authService.getUser().pipe(
      take(1),
      map(user => (user ? true : this.router.createUrlTree(['/auth/login'])))
    );
  }
}

import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OnlyAdminUsersGuard implements CanActivate {
  constructor() {}

  canActivate() {
    const user = (<any>window).user;
    return user && user.isAdmin;
  }
}

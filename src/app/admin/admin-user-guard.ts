import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class OnlyAdminUsersGuard implements CanActivate {
  canActivate() {
    const user = (<any>window).user;
    return user && user.isAdmin;
  }
}

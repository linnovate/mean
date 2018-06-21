import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  user: any = (<any>window).user;

  constructor() {}

  canActivate() {
    if(!this.user) return false;
    return this.user.isAdmin;
  }
}

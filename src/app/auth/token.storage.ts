import { Injectable } from '@angular/core';


const TOKEN_KEY = 'AuthToken';

@Injectable()
export class TokenStorage {

  constructor() { }

  signOut() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.clear();
  }

  public saveToken(token: string) {
    if (!token) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY,  token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }
}
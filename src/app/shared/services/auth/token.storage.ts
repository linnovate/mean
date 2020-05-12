import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private tokenKey = 'authToken';

  signOut(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.clear();
  }

  saveToken(token?: string): void {
    if (!token) return;
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}

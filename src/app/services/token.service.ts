import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { Order } from '../models/Order.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private tokenKey = 'authToken';
  private userKey = 'userDetails';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setUserDetails(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUserDetails(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  removeUserDetails() {
    localStorage.removeItem(this.userKey);
  }

  //converting the token exp date{.exp} to seconds
  private getTokenExpirationDate(token: string): Date | null {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (decoded.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate ? expirationDate < new Date() : true;
  }
}

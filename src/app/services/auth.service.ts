import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/User.model';
import { TokenService } from './token.service';
import { baseUrl } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  http: HttpClient = inject(HttpClient);
  tokenService: TokenService = inject(TokenService);

  private logoutTimer: any;

  //sign up
  signUp(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    return this.http.post<{ data: { user: User } }>(
      `${baseUrl}auth/signup`,
      userData
    );
  }

  //login
  login(userData: { email: string; password: string }): Observable<string> {
    return this.http
      .post<{ token: string }>(`${baseUrl}auth/login`, userData)
      .pipe(map((response) => response.token));
  }

  //getUserDetails
  fetchUserDetails(): Observable<User> {
    return this.http
      .get<{ data: { user: User } }>(`${baseUrl}auth/verify`)
      .pipe(map((response) => response.data.user as User));
  }

  //logout
  logout() {
    this.tokenService.removeToken();
    this.tokenService.removeUserDetails();
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  scheduleAutoLogout(timeoutInSeconds: number) {
    this.logoutTimer = setTimeout(() => this.logout(), timeoutInSeconds * 1000);
  }
}

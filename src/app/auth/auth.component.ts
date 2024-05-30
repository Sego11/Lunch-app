import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User.model';
import { InitializationService } from '../services/initialization.service';
import { Subscription } from 'rxjs';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  tokenService: TokenService = inject(TokenService);
  initializationService: InitializationService = inject(InitializationService);

  errorMessage: string | null = '';
  user: User | null = null;
  private userSubject: Subscription | undefined;

  userData = {
    name: 'desmond',
    email: 'desmond@gmail.com',
    password: 'Password123',
  };

  ngOnInit(): void {
    this.userSubject = this.initializationService
      .getCurrentUser()
      .subscribe((user: User | null) => {
        if (user) {
          this.user = user;
          //navigate to home
        }
      });
  }

  ngOnDestroy() {
    this.userSubject?.unsubscribe();
  }

  signUp() {
    this.authService.signUp(this.userData).subscribe({
      next: (data) => {
        //display a success message to the user and redirect to login
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  login() {
    const userData = {
      email: this.userData.email,
      password: this.userData.password,
    };
    this.authService.login(userData).subscribe({
      next: (token) => {
        this.tokenService.setToken(token);
        this.authService.fetchUserDetails().subscribe({
          next: (user: User) => {
            this.tokenService.setUserDetails(user);
          },
        });
        this.initializationService.initializeApp();
        //navigate to home
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      },
    });
  }

  logout() {
    this.authService.logout();
    console.log('logged out successfully');
  }
}

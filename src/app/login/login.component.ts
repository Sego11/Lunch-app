import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User.model';
import { InitializationService } from '../services/initialization.service';
import { Subscription } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  tokenService: TokenService = inject(TokenService);
  initializationService: InitializationService = inject(InitializationService);
  router: Router = inject(Router);

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
          this.router.navigate(['main']);
        }
      });
  }

  ngOnDestroy() {
    this.userSubject?.unsubscribe();
  }

  signUp() {
    this.authService.signUp(this.userData).subscribe({
      next: () => {
        //display a success message to the user and redirect to login
        this.router.navigate(['login']);
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
            console.log('loggedIn user: ', user.name);
            this.tokenService.setUserDetails(user);
          },
        });
        this.initializationService.initializeApp();
        //navigate to home
        this.router.navigate(['']);
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      },
    });
  }
}

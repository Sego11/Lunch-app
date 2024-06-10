import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User.model';
import { InitializationService } from '../services/initialization.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  tokenService: TokenService = inject(TokenService);
  initializationService: InitializationService = inject(InitializationService);
  router: Router = inject(Router);

  isLogin: boolean = true;
  isLoading: boolean = false;
  name: string = '';
  email: string = '';
  password: string = '';
  showToast: boolean = false;
  toastMessage: string = '';
  isToastSuccess: boolean = true;
  passwordFieldType: string = 'password';

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleView(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
  }

  onFormSubmitted(event: Event): void {
    if (this.isLogin) {
      console.log(this.password);
      this.login();
    } else {
      this.signUp();
    }
  }

  ngOnInit(): void {
    this.initializationService
      .getCurrentUser()
      .subscribe((user: User | null) => {
        if (user) {
          this.router.navigate(['main']);
        }
      });
  }

  signUp() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.isLoading = true;

    this.authService.signUp(userData).subscribe({
      next: () => {
        setTimeout(() => {
          this.isLoading = false;
          this.showToastMessage(
            `Account successfully created. Login to proceed`,
            true
          );
        }, 2000);

        this.isLogin = true;
      },
      error: (error) => {
        setTimeout(() => {
          this.isLoading = false;
          this.showToastMessage(error.error.message, false);
        }, 2000);
      },
    });
  }

  login() {
    const userData = {
      email: this.email,
      password: this.password,
    };

    this.isLoading = true;

    this.authService.login(userData).subscribe({
      next: (token) => {
        this.tokenService.setToken(token);
        this.authService.fetchUserDetails().subscribe({
          next: (user: User) => {
            this.tokenService.setUserDetails(user);
          },
        });
        this.initializationService.initializeApp();
        this.router.navigate(['']);
      },
      error: (error) => {
        setTimeout(() => {
          this.isLoading = false;
          this.showToastMessage(error.error.message, false);
        }, 2000);
      },
    });
  }

  showToastMessage(message: string, isSuccess: boolean) {
    this.toastMessage = message;
    this.isToastSuccess = isSuccess;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}

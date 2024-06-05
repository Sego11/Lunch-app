import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { InitializationService } from '../services/initialization.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription | undefined;
  authService: AuthService = inject(AuthService);
  initializationService: InitializationService = inject(InitializationService);

  isAdmin: boolean = false;

  ngOnInit() {
    this.userSub = this.initializationService
      .getCurrentUser()
      .subscribe((user) => {
        if (user?.role === 'admin') {
          this.isAdmin = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  logout() {
    this.authService.logout();
    console.log('logged out successfully');
  }
}

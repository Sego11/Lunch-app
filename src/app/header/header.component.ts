import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  authService: AuthService = inject(AuthService);

  logout() {
    this.authService.logout();
    console.log('logged out successfully');
  }
}

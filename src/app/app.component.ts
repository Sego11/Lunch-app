import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { InitializationService } from './services/initialization.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  initializationService: InitializationService = inject(InitializationService);
  router: Router = inject(Router);

  title = 'LUNCH-APP';
  userSub: Subscription | undefined;

  ngOnInit(): void {
    this.initializationService.initializeApp();
    this.userSub = this.initializationService
      .getCurrentUser()
      .subscribe((user) => {
        if (!user) {
          //redirect to login
          this.router.navigate(['']);
        }
      });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { InitializationService } from './services/initialization.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'LUNCH-APP';
  initializationService: InitializationService = inject(InitializationService);
  userSub: Subscription | undefined;

  ngOnInit(): void {
    this.initializationService.initializeApp();
    this.userSub = this.initializationService
      .getCurrentUser()
      .subscribe((user) => {
        if (!user) {
          //redirect to login
        }
      });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User.model';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class InitializationService {
  authService: AuthService = inject(AuthService);
  tokenService: TokenService = inject(TokenService);

  //create a behaviour subject to emit user objects
  private currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  //we assign this variable to the behaviour subject so we can subscribe to it
  //to get the user object anywhere across the app
  public currentUser: Observable<User | null> =
    this.currentUserSubject.asObservable();

  initializeApp(): void {
    const token = this.tokenService.getToken();
    const storedUser: User = this.tokenService.getUserDetails();

    //checking whether the user's token hasn't expired and still has the info stored
    //use case: when you are opening the page within 6 hours
    if (token && !this.tokenService.isTokenExpired(token) && storedUser) {
      //this subject emits the storeduser
      this.currentUserSubject.next(storedUser);

      //get the time for the user's token to expire in seconds
      const timeoutInSeconds = storedUser.exp - Math.floor(Date.now() / 1000);

      //we set the autoLogout time for the current logged user
      this.authService.scheduleAutoLogout(timeoutInSeconds);

      //checks whether the user's token hasn't expired
      //use case: when logging in
    } else if (token && !this.tokenService.isTokenExpired(token)) {
      //call the fetchUserDetails to fetch the just logged in user details
      this.authService.fetchUserDetails().subscribe({
        //when success it will return a user object
        next: (user: User) => {
          //save the current user details to localStorage
          this.tokenService.setUserDetails(user);

          //the behaviour subject emits the user found
          this.currentUserSubject.next(user);

          //get the time for the user's token to expire in seconds
          const timeoutInSeconds = user.exp - Math.floor(Date.now() / 1000);

          //we set the autoLogout time for the current logged user
          this.authService.scheduleAutoLogout(timeoutInSeconds);
        },

        //when there is an error inn fetchUserDetails
        error: () => {
          this.authService.logout();

          //the subject emits null
          this.currentUserSubject.next(null);
        },
      });
    } else {
      this.authService.logout();
      this.currentUserSubject.next(null);
    }
  }

  //function to get the current object emitted by the behaviour subject
  //the behaviour subject can emit either a user or null
  getCurrentUser(): Observable<User | null> {
    return this.currentUser;
  }
}

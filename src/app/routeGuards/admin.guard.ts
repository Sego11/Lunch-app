import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { InitializationService } from '../services/initialization.service';
import { Observable, map } from 'rxjs';

export const canActivate = (
  router: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const initializationService: InitializationService = inject(
    InitializationService
  );

  return initializationService.getCurrentUser().pipe(
    map((user) => {
      if (user?.role === 'admin') {
        return true;
      } else {
        console.log('not an admin wai');
        return false;
      }
    })
  );
};

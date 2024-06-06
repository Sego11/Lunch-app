import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Dish } from '../models/Dish.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { baseUrl } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  http: HttpClient = inject(HttpClient);

  //get all dishes
  GetAllDishes(day?: string): Observable<Dish[]> {
    let params = new HttpParams();
    if (day) params = params.append('day', day);

    return this.http.get<any>(`${baseUrl}dishes`, { params }).pipe(
      map((response) => {
        return response.data.dishes as Dish[];
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  //create dish
  CreateDish(data: Dish): Observable<Dish> {
    return this.http.post<any>(`${baseUrl}dishes`, data).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  //update dish
  UpdateDish(id: string, data: Dish): Observable<Dish> {
    return this.http.patch<any>(`${baseUrl}dishes/${id}`, data).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  //delete dish
  DeleteDish(id: string) {
    return this.http.delete<any>(`${baseUrl}dishes/${id}`).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}

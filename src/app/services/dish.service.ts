import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Dish } from '../models/Dish.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  baseUrl: string = 'http://localhost:3000/api/v1/';

  http: HttpClient = inject(HttpClient);

  //get all dishes
  GetAllDishes(day?: string): Observable<Dish[]> {
    let params = new HttpParams();
    if (day) params = params.append('day', day);

    return this.http.get<any>(`${this.baseUrl}dishes`, { params }).pipe(
      map((response) => {
        return response.data.dishes as Dish[];
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  //create dish
  CreateDish(name: string, day: string): Observable<Dish> {
    const data = {
      name: name,
      day: day,
    };

    return this.http.post<any>(`${this.baseUrl}dishes`, data).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  //update dish
  UpdateDish(id: string, name?: string, day?: string): Observable<Dish> {
    const data = {
      name: name,
      day: day,
    };

    return this.http.patch<any>(`${this.baseUrl}dishes/${id}`, data).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  //delete dish
  DeleteDish(id: string) {
    return this.http.delete<any>(`${this.baseUrl}dishes/${id}`).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}

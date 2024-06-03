import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Order } from '../models/Order.model';
import { TokenService } from './token.service';
import { baseUrl } from '../utils/utils';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<{ data: { orders: Order[] } }>(`${baseUrl}orders/get-all-orders/`)
      .pipe(
        map((response) => {
          return response.data.orders as Order[];
        })
      );
  }

  getOrder(user: string): Observable<Order> {
    let params = new HttpParams();
    params = params.append('user', user);

    return this.http
      .get<{ data: { userOrder: Order } }>(`${baseUrl}orders/get-order/`, {
        params,
      })
      .pipe(map((res) => res.data.userOrder as Order));
  }

  createOrder(dish_id: string, user_id: string): Observable<Order> {
    const orderData = {
      dish: dish_id,
      user: user_id,
    };

    return this.http
      .post<{ data: { order: Order } }>(
        `${baseUrl}orders/create-order/`,
        orderData
      )
      .pipe(
        map((response) => {
          const order: Order = response.data.order;
          return order;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  deleteOrder(id: string) {
    return this.http.delete(`${baseUrl}orders/delete-order/${id}`);
  }

  deleteAllOrders() {
    return this.http.delete(`${baseUrl}orders/delete-all-orders/`);
  }
}

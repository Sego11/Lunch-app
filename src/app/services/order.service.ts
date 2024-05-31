import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Order } from '../models/Order.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  baseUrl: string = 'http://localhost:3000/api/v1/';

  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<{ data: { orders: Order[] } }>(
        `${this.baseUrl}orders/get-all-orders/`
      )
      .pipe(
        map((response) => {
          return response.data.orders as Order[];
        })
      );
  }

  getOrder(id: string): Observable<Order> {
    return this.http
      .get<{ data: { order: Order } }>(`${this.baseUrl}orders/get-order/${id}`)
      .pipe(map((res) => res.data.order as Order));
  }

  createOrder(dish_id: string, user_id: string): Observable<Order> {
    const orderData = {
      dish: dish_id,
      user: user_id,
    };

    return this.http
      .post<{ data: { order: Order } }>(
        `${this.baseUrl}orders/create-order/`,
        orderData
      )
      .pipe(
        map((response) => {
          const order: Order = response.data.order;
          this.tokenService.setOrderDetails(order);
          return order;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  deleteOrder(id: string) {
    return this.http.delete(`${this.baseUrl}orders/delete-order/${id}`);
  }

  deleteAllOrders() {
    return this.http.delete(`${this.baseUrl}orders/delete-all-orders/`);
  }
}

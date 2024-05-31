import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Order } from '../models/Order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

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
      .pipe(map((response) => response.data.order as Order));
  }

  deleteOrder(id: string) {
    return this.http.delete(`${this.baseUrl}orders/delete-order/${id}`);
  }

  deleteAllOrders(){
    return this.http.delete(`${this.baseUrl}orders/delete-all-orders/`)
  }
}

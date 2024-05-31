import { Component, OnInit, inject } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/Order.model';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-your-order',
  templateUrl: './your-order.component.html',
  styleUrls: ['./your-order.component.css'],
})
export class YourOrderComponent implements OnInit {
  orderService: OrderService = inject(OrderService);
  tokenService: TokenService = inject(TokenService);

  savedOrder: Order | null = this.tokenService.getOrderDetails();
  order_id: string | undefined = this.savedOrder?._id;
  orderToRender: Order | null = null;

  ngOnInit(): void {
    this.getUserOrder();
  }

  //getUserOrder
  //store in the order variable
  getUserOrder() {
    if (this.order_id)
      this.orderService.getOrder(this.order_id).subscribe({
        next: (order: Order) => {
          this.orderToRender = order;
        },
        error: (error) => {
          console.log(error.error.message);
        },
      });
  }

  //deleteOrder
  deleteOrder() {
    if (this.order_id)
      this.orderService.deleteOrder(this.order_id).subscribe({
        next: () => {
          console.log(' deleted order successfully');
          this.tokenService.removeOrderDetails();
        },
        error: (error) => {
          console.log(error.error.message);
        },
      });
  }
}

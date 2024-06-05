import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/Order.model';
import { TokenService } from '../../services/token.service';
import { InitializationService } from '../../services/initialization.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/User.model';

@Component({
  selector: 'app-your-order',
  templateUrl: './your-order.component.html',
  styleUrls: ['./your-order.component.css'],
})
export class YourOrderComponent implements OnInit, OnDestroy {
  orderService: OrderService = inject(OrderService);
  tokenService: TokenService = inject(TokenService);
  initializationService: InitializationService = inject(InitializationService);

  order: Order | null = null;
  userSub: Subscription | undefined;
  currentUser: User | null = null;
  hasOrdered: boolean = false;
  isLoading: boolean = false;

  @Output() closeOrderCard: EventEmitter<boolean> = new EventEmitter<boolean>();

  onCloseOrderCard() {
    this.closeOrderCard.emit();
  }

  ngOnInit(): void {
    this.userSub = this.initializationService
      .getCurrentUser()
      .subscribe((user) => {
        this.currentUser = user;
      });
    this.getUserOrder();
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  getUserOrder() {
    this.isLoading = true;
    const user_id = this.currentUser?._id;
    if (user_id) {
      this.orderService.getOrder(user_id).subscribe({
        next: (order: Order) => {
          this.isLoading = false;
          this.order = order;
          this.hasOrdered = true;
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error.error.message);
        },
      });
    } else {
      console.log('cannot read id');
    }
  }

  deleteOrder() {
    this.isLoading = true;
    if (this.order)
      this.orderService.deleteOrder(this.order._id).subscribe({
        next: () => {
          this.isLoading = false;
          this.hasOrdered = false;
          this.order = null;
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error.error.message);
        },
      });
  }
}

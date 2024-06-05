import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../models/Dish.model';
import { OrderService } from '../services/order.service';
import { Order } from '../models/Order.model';
import { Subscription, retry } from 'rxjs';
import { InitializationService } from '../services/initialization.service';
import { User } from '../models/User.model';
import { getTodayName } from '../utils/utils';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, OnDestroy {
  initializationService: InitializationService = inject(InitializationService);
  dishService: DishService = inject(DishService);
  orderService: OrderService = inject(OrderService);

  private userSub: Subscription | undefined;
  currentUser: User | null = null;
  allDishes: Dish[] = [];
  currentDayName = '';
  dish_id: string = '';
  showToast: boolean = false;
  toastMessage: string = '';
  isToastSuccess: boolean = true;
  fetchingDishes: boolean = false;
  isOrderButtonPressed: boolean = false;
  loadingDishIds: Set<string> = new Set();

  ngOnInit() {
    this.userSub = this.initializationService
      .getCurrentUser()
      .subscribe((user) => (this.currentUser = user));
    this.currentDayName = getTodayName(new Date());
    this.getAllDishes();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  getAllDishes() {
    this.fetchingDishes = true;
    this.dishService.GetAllDishes(this.currentDayName).subscribe({
      next: (data: Dish[]) => {
        this.fetchingDishes = false;
        this.allDishes = data;
      },
      error: (error) => {
        setTimeout(() => {
          this.fetchingDishes = false;
          this.showToastMessage(error.error.message, false);
        }, 2000);
      },
    });
  }

  createOrder(id: string) {
    this.loadingDishIds.add(id);
    this.dish_id = id;
    if (this.currentUser)
      this.orderService
        .createOrder(this.dish_id, this.currentUser._id)
        .subscribe({
          next: (order: Order) => {
            setTimeout(() => {
              this.loadingDishIds.delete(id);

              this.showToastMessage(
                'Order successfully made. check your orders to see your order',
                true
              );
            }, 2000);
          },
          error: (error) => {
            setTimeout(() => {
              this.loadingDishIds.delete(id);
              this.showToastMessage(error.error.message, false);
            }, 2000);
            console.log(error.error.message);
          },
        });
  }

  showToastMessage(message: string, isSuccess: boolean) {
    this.toastMessage = message;
    this.isToastSuccess = isSuccess;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  openOrderCard() {
    this.isOrderButtonPressed = true;
  }

  onCloseOrderCard() {
    this.isOrderButtonPressed = false;
  }

  isDishLoading(id: string): boolean {
    return this.loadingDishIds.has(id);
  }
}

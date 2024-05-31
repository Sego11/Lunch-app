import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../models/Dish.model';
import { OrderService } from '../services/order.service';
import { Order } from '../models/Order.model';
import { Subscription } from 'rxjs';
import { InitializationService } from '../services/initialization.service';
import { User } from '../models/User.model';
import { getTodayName } from '../utils/get.current.day';

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
  errorMessage: string = '';
  currentDayName = '';

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
    this.dishService.GetAllDishes(this.currentDayName).subscribe({
      next: (data: Dish[]) => {
        this.allDishes = data;
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        console.log(this.errorMessage);
      },
    });
  }

  //createOrder
  createOrder() {
    const dish_id = '6655ef2dc9decabdcebf6b33';
    let user_id = '';
    if (this.currentUser) user_id = this.currentUser._id;

    this.orderService.createOrder(dish_id, user_id).subscribe({
      next: (order: Order) => {
        console.log(order);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}

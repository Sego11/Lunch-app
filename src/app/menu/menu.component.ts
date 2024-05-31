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
  name = 'Gari and Shito';
  day = 'tuesday';
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

  //declare a template variable and add ngForm to it
  //use the @ViewChild() to get the instance of the form
  //to get the user inputs in the form

  createDish() {
    this.dishService.CreateDish(this.name, this.day).subscribe({
      next: (dish: Dish) => {
        console.log(dish);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  id = '6657516f7e2ea46673f07be9';
  updateDish() {
    this.dishService.UpdateDish(this.id, this.name).subscribe({
      next: (data: Dish) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  deleteDish() {
    this.dishService.DeleteDish(this.id).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  //getAllOrders
  getAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        console.log(orders);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  //createOrder
  createOrder() {
    const dish_id = '66570bcdaffb44b8535f0898';
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

  //deleteOrder
  deleteOrder() {
    const order_id = '6655f04525a4ce5ee578d63c';

    this.orderService.deleteOrder(order_id).subscribe({
      next: () => {
        console.log(' deleted order successfully');
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  deleteAllOrders() {
    this.orderService.deleteAllOrders().subscribe({
      next: () => {
        console.log(' deleted all order successfully');
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }
}

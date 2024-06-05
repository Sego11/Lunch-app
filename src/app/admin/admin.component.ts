import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../models/Order.model';
import { DishService } from '../services/dish.service';
import { Dish } from '../models/Dish.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private dishService: DishService
  ) {}

  allOrders: Order[] = [];
  allDishes: Dish[] = [];
  name = '';
  day = '';
  fetchingDishes: boolean = false;
  fetchingOrders: boolean = false;

  ngOnInit(): void {
    this.getAllOrders();
    this.getAllDishes();
  }

  getAllOrders() {
    this.fetchingOrders = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.fetchingOrders = false;
        this.allOrders = orders;
      },
      error: (error) => {
        this.fetchingOrders = false;
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

  getAllDishes() {
    this.fetchingDishes = true;
    this.dishService.GetAllDishes().subscribe({
      next: (dishes: Dish[]) => {
        this.fetchingDishes = false;
        this.allDishes = dishes;
      },
      error: (error) => {
        this.fetchingDishes = false;
        console.log(error.error.message);
      },
    });
  }

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

  updateDish(id: string) {
    this.dishService.UpdateDish(id, this.name).subscribe({
      next: (data: Dish) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  deleteDish(id: string) {
    this.dishService.DeleteDish(id).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}

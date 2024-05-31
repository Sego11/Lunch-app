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
  name = 'Gari and Shito';
  day = 'tuesday';

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.allOrders = orders;
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
}

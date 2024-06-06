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
  fetchingDishes: boolean = false;
  fetchingOrders: boolean = false;
  isCreateDishPressed: boolean = false;
  selectedDish: Dish | undefined = undefined;
  selectedDishId: string | undefined = '';
  editMode: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  isToastSuccess: boolean = true;
  loadingDishIds: Set<string> = new Set();

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
        setTimeout(() => {
          this.fetchingOrders = false;
          this.showToastMessage(error.error.message, false);
        }, 2000);
      },
    });
  }

  deleteAllOrders() {
    this.orderService.deleteAllOrders().subscribe({
      next: () => {
        setTimeout(() => {
          this.showToastMessage('deleted all orders successfully', true);
        }, 2000);
        this.getAllOrders();
      },
      error: (error) => {
        setTimeout(() => {
          this.showToastMessage(error.error.message, false);
        }, 2000);
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
        setTimeout(() => {
          this.fetchingDishes = false;
          this.showToastMessage(error.error.message, false);
        }, 2000);
      },
    });
  }

  createDish(data: Dish) {
    this.dishService.CreateDish(data).subscribe({
      next: (dish: Dish) => {
        setTimeout(() => {
          this.showToastMessage('Dish successfully created', true);
        }, 2000);
        this.getAllDishes();
      },
      error: (error) => {
        setTimeout(() => {
          this.showToastMessage(error.error.message, false);
        }, 2000);
      },
    });
  }

  updateDish(id: string, data: Dish) {
    this.dishService.UpdateDish(id, data).subscribe({
      next: () => {
        setTimeout(() => {
          this.showToastMessage('Dish successfully updated', true);
        }, 2000);
        this.getAllDishes();
      },
      error: (error) => {
        setTimeout(() => {
          this.showToastMessage(error.error.message, false);
        }, 2000);
      },
    });
  }

  deleteDish(id: string) {
    this.selectedDishId = id;
    this.loadingDishIds.add(id);

    this.dishService.DeleteDish(id).subscribe({
      next: () => {
        setTimeout(() => {
          this.loadingDishIds.delete(id);
          this.showToastMessage('Dish successfully deleted', true);
        }, 2000);
        this.getAllDishes();
      },
      error: (error) => {
        setTimeout(() => {
          this.loadingDishIds.delete(id);
          this.showToastMessage(error.error.message, false);
        }, 2000);
      },
    });
  }

  openCreateDishForm() {
    this.isCreateDishPressed = true;
    this.editMode = false;
    this.selectedDish = { _id: '', name: '', day: '' };
  }

  onCloseCreateDishFrom() {
    this.isCreateDishPressed = false;
  }

  onEditDishClicked(id: string | undefined) {
    this.selectedDishId = id;

    this.isCreateDishPressed = true;
    this.editMode = true;

    this.selectedDish = this.allDishes.find((dish) => {
      return dish._id === id;
    });
  }

  createOrEditDish(data: Dish) {
    if (!this.editMode) {
      this.createDish(data);
    } else {
      if (this.selectedDishId) this.updateDish(this.selectedDishId, data);
    }
  }

  showToastMessage(message: string, isSuccess: boolean) {
    this.toastMessage = message;
    this.isToastSuccess = isSuccess;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  isDishLoading(id: string): boolean {
    return this.loadingDishIds.has(id);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../models/Dish.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  dishService: DishService = inject(DishService);
  allDishes: Dish[] = [];
  errorMessage: string = '';
  name = 'Gari and Shito';
  day = 'tuesday';

  ngOnInit() {
    this.fetchDishes();
  }

  fetchDishes() {
    this.getAllDishes();
  }

  private getAllDishes() {
    this.dishService.GetAllDishes().subscribe({
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
}

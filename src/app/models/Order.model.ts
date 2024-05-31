import { Dish } from './Dish.model';
import { User } from './User.model';

export interface Order {
  _id: string;
  dish: Dish;
  user: User;
}

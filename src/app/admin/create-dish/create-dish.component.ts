import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Dish } from 'src/app/models/Dish.model';

@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.css'],
})
export class CreateDishComponent {
  @Input() isEditMode: boolean = false;

  @Input() selectedDish: any;

  @Output() closeForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() emitDishData: EventEmitter<Dish> = new EventEmitter<Dish>();

  @ViewChild('dishForm') dishForm: NgForm | undefined;

  isLoading: boolean = false;

  ngAfterViewInit() {
    setTimeout(() => {
      this.dishForm?.form.patchValue(this.selectedDish);
    }, 0);
  }

  onCloseForm() {
    this.closeForm.emit(false);
  }

  onFormSubmit(form: NgForm) {
    this.isLoading = true;
    setTimeout(() => {
      this.closeForm.emit(false);
      this.isLoading = false;
    }, 3000);
    this.emitDishData.emit(form.value);
  }
}

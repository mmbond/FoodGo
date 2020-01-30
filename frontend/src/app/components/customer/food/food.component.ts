import { Component, OnInit } from '@angular/core';
import { Meal } from 'src/app/models/meal.model';
import { HistoryService } from 'src/app/services/history.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { CustomerProfile } from 'src/app/models/customer-profile.model';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.sass']
})
export class FoodComponent implements OnInit {

  favMeals: Array<Meal>;
  error: any;
  total: Array<number>;
  current: number;
  limit = 5; 
  constructor( private _historyService: HistoryService) { }

  ngOnInit() {
    this._fetchFavouriteMeals(10);
  }

  private _fetchFavouriteMeals(limit: number = 1) {
    let customer: CustomerProfile = JSON.parse(localStorage.getItem("customer"));
    this.favMeals = customer.fav_meals_result;
    this.total = Array(Math.ceil(this.favMeals.length / this.limit));
    this.current = 1;
  }

  public showFavourite() : boolean {
    return this.favMeals != undefined && this.favMeals.length != 0;
  }

  public receiveCurrentPage($event) {
    this.current = $event;
    console.log($event);
  }

  public getPageLimit(id: number) {
    return (((this.current - 1) * this.limit) <= id) && (id < (this.current * this.limit));
  }
}
 
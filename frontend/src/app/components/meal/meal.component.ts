import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/services/meal.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { Meal } from 'src/app/models/meal.model';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.sass']
})
export class MealComponent implements OnInit {
  @Input() meals: Array<Meal>;
  @Input() restaurant: Restaurant;
  orderMeals : Array<Meal> = [];
  error: any;
  favorite = false;
  constructor(private _mealService: MealService, private _restaurantService: RestaurantService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      window.scrollTo(0, 0);
      this._fetchMeals(params['restaurantId']);
      this._fetchRestaurant(params['restaurantId']);
    });
  }

  private _fetchMeals(restaurantId: number) {
    return this._mealService.getMeals(restaurantId).toPromise()
      .then(response => this.meals = response)
      .catch(error => this.error = ErrorHelper.generateErrorObj(error));
  }
  private _fetchRestaurant(restaurantId: number) {
    this._restaurantService.getRestuarant(restaurantId).toPromise()
      .then(response => this.restaurant = response)
      .catch(error => this.error = ErrorHelper.generateErrorObj(error));
  }
  private getRestaurantImage(): string {
    return this.restaurant != null ? `url(${this.restaurant.restorantLogo})` : 'none';
  }

  private getCategories(): Set<string> {
    let categories = new Set<string>();
    this.meals.forEach(meal => categories.add(meal.category));
    return categories;
  }

  private addToOrder(mealName:string) {
    this.orderMeals.push(this.meals.find(meal => meal.name == mealName));
  }

  private isFavorite(restaurantName : string) {
    // TODO Implement this
    this.favorite = !this.favorite;
    console.log(restaurantName); 
    console.log(this.favorite); 
  }

  private scrollToCategory(category : string) {
    document.getElementById(category).scrollIntoView();
  }

  private hasOrders() : boolean {
    if (this.orderMeals == undefined || this.orderMeals.length==0) {
      return false;
      
    }
    return true;
  }
}

import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/services/meal.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { Meal } from 'src/app/models/meal.model';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { Restaurant } from 'src/app/models/restaurant.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Ingredients } from 'src/app/models/ingredients.model';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.sass']
})
export class MealComponent implements OnInit {
  @Input() meals: Array<Meal>;
  @Input() restaurant: Restaurant;
  @ViewChild('closeMealModal', { static: true }) closeMealModal: ElementRef;
  orderMeals: Array<Meal> = [];
  activeCategory: string;
  error: any;
  favorite = false;
  chosedMeal: Meal;
  ingredients: Array<Ingredients>;
  constructor(private _mealService: MealService, private _restaurantService: RestaurantService, private route: ActivatedRoute, public sanitizer: DomSanitizer) { }

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

  private chooseMealToOrder(id) {
    this.chosedMeal = this.meals[id];
    this.ingredients = this.meals[id].ingredients;
  }

  private addToOrder() {
    this.orderMeals.push(this.chosedMeal);
    this.closeMealModal.nativeElement.click();
  }

  private isFavorite(restaurantName: string) {
    // TODO Implement this
    this.favorite = !this.favorite;
  }
  private isFavoriteFood(mealName: string) {
    // TODO Implement this
    console.log(mealName);
    this.favorite = !this.favorite;
  }

  private scrollToCategory(category: string) {
    this.activeCategory = category;
    document.getElementById(category).scrollIntoView();
  }

  private hasOrders(): boolean {
    if (this.orderMeals == undefined || this.orderMeals.length == 0) {
      return false;

    }
    return true;
  }

  private isActive(category: string): boolean {
    return this.activeCategory == category;
  }

  private firstCategory(category: string, index: number): boolean {
    var first = this.meals.findIndex(meal => meal.category == category);
    return first == index;
  }

  private getMapUrl() {
    let url = "https://maps.google.com/maps?q=" + this.restaurant.address.replace(/ /gi, "+") + "," + this.restaurant.name.replace(/ /gi, "+") + "&output=embed";
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealService } from 'src/app/services/meal.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { Meal } from 'src/app/models/meal.model';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { Restaurant } from 'src/app/models/restaurant.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Ingredients } from 'src/app/models/ingredients.model';
import { CustomerProfile } from 'src/app/models/customer-profile.model';
import { CustomerService } from 'src/app/services/customer.service';

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
  visibleMeals: Array<Meal>;
  activeCategory: string;
  error: any;
  favorite = false;
  chosedMeal: Meal;
  ingredients: Array<Ingredients>;
  constructor(private _mealService: MealService, private _restaurantService: RestaurantService, private _customerService: CustomerService, private route: ActivatedRoute, public sanitizer: DomSanitizer) { }

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
    return this.restaurant != null ? `url(${this.restaurant.restaurantLogo})` : 'none';
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

  private isFavoriteRest(restaurantName: string) {
    let customer: CustomerProfile = JSON.parse(localStorage.getItem("customer"));
    return customer.fav_restaurants.includes(restaurantName);
  }

  private sendFavoriteRest(restaurantName: string) {
    let customer: CustomerProfile = JSON.parse(localStorage.getItem("customer"));
    if (this.isFavoriteRest(restaurantName)) {
      customer.fav_restaurants_result.splice(customer.fav_restaurants_result.findIndex((r)=>r==this.restaurant),1);
      customer.fav_restaurants.splice(customer.fav_restaurants.findIndex((r)=> r==restaurantName),1);
    } else {
      customer.fav_restaurants_result.push(this.restaurant);
      customer.fav_restaurants.push(restaurantName);
    } 
    localStorage.setItem("customer",JSON.stringify(customer));
    this._customerService.updateFavRestaurants(customer.fav_restaurants);
  }

  private isFavoriteMeal(mealName: string) {
    let customer: CustomerProfile = JSON.parse(localStorage.getItem("customer"));
    return customer.fav_meals.includes(mealName);
  }

  private sendFavoriteMeal(meal: Meal) {
    console.log(meal);
    let customer: CustomerProfile = JSON.parse(localStorage.getItem("customer"));
    if (this.isFavoriteMeal(meal.name)) {
      console.log('skloni');
      customer.fav_meals_result.splice(customer.fav_meals_result.findIndex((m)=>m.name==meal.name),1);
      customer.fav_meals.splice(customer.fav_meals.findIndex((m)=>m==meal.name),1);
    } else {
      customer.fav_meals_result.push(meal);
      customer.fav_meals.push(meal.name);
    } 
    localStorage.setItem("customer",JSON.stringify(customer));
    this._customerService.updateFavMeals(customer.fav_meals);
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

  private loggedIn(): boolean {
    if(localStorage.getItem("customer")){
      return true;
    }
    return false;
  }

  private pretraga(event: any) {
    if (event.target.value == '') {
      this.visibleMeals = undefined;
      return;
    }
    this.visibleMeals = this.meals.filter(meal=>meal.name.toLowerCase().includes(event.target.value.toLowerCase())).slice(0,5);
  }

  private scrollToMeal(meal: Meal) {
    this.activeCategory = meal.category;
    document.getElementById(meal.name).scrollIntoView();
  }

}

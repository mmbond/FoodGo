import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Meal } from 'src/app/models/meal.model';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order.model';
import { Status } from 'src/app/models/status.model';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.sass']
})
export class OrderComponent implements OnInit {
  @Input()
  mealOrder: Array<Meal>;
  @Output() mealOrderChange = new EventEmitter();
  @Input()
  restaurantOrder: Restaurant;

  orderPrice = 0;
  mealCount: Array< number > = [];

  constructor(private orderService: OrderService) { }

  ngOnInit() {
  }

  private mealsToSet() {
    let data = this.mealOrder.map(meal => meal.name).reduce(function (acc, curr) {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
    
      return acc;
    }, {});
    let mealCount = Object.keys(data).map(key => ({name: String(key), count: data[key]}));
    this.mealCount = mealCount.map(meal => meal.count);
    return new Set(this.mealOrder);
  }

  private hasOrders(): boolean {
    if (this.mealOrder == undefined || this.mealOrder.length == 0) {
      return false;

    }
    this.orderPrice = this.mealOrder.map(meal => meal.price).reduce((accumulator, currentValue) => accumulator + currentValue);
    return true;
  }

  private addToOrder(meal: Meal) {
    this.mealOrder.push(meal);
    this.mealOrderChange.emit(this.mealOrder);
  }

  private removeFromOrder(mealName: string) {
    var id = this.mealOrder.findIndex(meal => meal.name == mealName);
    this.mealOrder.splice(id,1)
    this.mealOrderChange.emit(this.mealOrder);
  }

  private hasOrder(mealName: string) {
    return this.mealOrder.filter(meal => meal.name == mealName).length != 1;
  }

  private clearOneOrder(mealName: string) {
    this.mealOrder = this.mealOrder.filter(meal => meal.name != mealName);
    this.mealOrderChange.emit(this.mealOrder);
  }

  private clearOrder() {
    this.mealOrder = [];
    this.mealOrderChange.emit(this.mealOrder);
  }

  private sendOrder() {
    // TODO saljem preko apija
    let order : Order = {
      orderId: null,
      restaurant: this.restaurantOrder,
      status: Status.IN_PROGRESS,
      meals: this.mealOrder,
      comment: null, // TODO pregled spec za razliku comment note
      orderDate: new Date(), // definisati foramt data koji se salje backendu
      price: this.orderPrice,
      note: null // TDOO add note
    }
    //console.log(order);
    let orderRecieved = this.orderService.send(order);
    if (orderRecieved) {
      // TODO mozda neki dijalog se pojavljuje
      this.clearOrder();
    }
  }

}

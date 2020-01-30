import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { HistoryService } from 'src/app/services/history.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { OrderService } from 'src/app/services/order.service';
import { Status} from 'src/app/models/status.model';
import { Meal } from 'src/app/models/meal.model';
import { CustomerProfile } from 'src/app/models/customer-profile.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {

  orders: Array<Order>;
  error: any;
  currentRate = 0;
  total: Array<number>;
  current: number;
  limit = 5; 
  constructor(private router: Router, private _orderService: OrderService, private _historyService: HistoryService) { }

  ngOnInit() {
    let customer: CustomerProfile = JSON.parse(localStorage.getItem("customer"));
    this._fetchOrders(customer.customerId);
  }

  private _fetchOrders(customerId: number) {
    this._historyService.getOrders(customerId).toPromise()
      .then(response => {this.orders = response; this.total = Array(Math.ceil(response.length/this.limit)); this.current = 1;})
  }

  public showOrders(): boolean {
    return this.orders != undefined;
  }

  private restaurant() {
    this.router.navigate(['/']);
  }

  private cancelOrder(id : number) {
    this.orders[id].status = Status.CANCELED;
    this._orderService.edit(this.orders[id]);
  }

  private mealList(meals: Array<Meal>) {
    let data = meals.map(meal => meal.name).reduce(function (acc, curr) {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
    
      return acc;
    }, {});
    return Object.keys(data).map(key => ({name: String(key), count: data[key]}));
  }

  public receiveCurrentPage($event) {
    this.current = $event;
  }

  public getPageLimit(id: number) {
    return (((this.current - 1) * this.limit) <= id) && (id < (this.current * this.limit));
  }

}

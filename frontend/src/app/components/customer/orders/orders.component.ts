import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { HistoryService } from 'src/app/services/history.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { OrderService } from 'src/app/services/order.service';
import { Status } from 'src/app/models/status.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {

  orders: Array<Order>;
  error: any;
  currentRate = 0;
  constructor(private router: Router, private _orderService: OrderService, private _historyService: HistoryService) { }

  ngOnInit() {
    this._fetchOrders(10);
  }

  private _fetchOrders(limit: number = 1) {
    this._historyService.getOrders(limit).toPromise()
      .then(response => this.orders = response)
      .catch(error => this.error = ErrorHelper.generateErrorObj(error));
  }


  public showOrders(): boolean {
    return this.orders != undefined;
  }

  private restaurant() {
    this.router.navigate(['/']);
  }

  private cancelOrder(id : number) {
    // TODO srediti ovo
    this.orders[id].status = 'CANCELED';
    this._orderService.cancel(this.orders[id]);
    
  }
}

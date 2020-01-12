import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { HistoryService } from 'src/app/services/history.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {

  orders: Array<Order>;
  error: any;
  constructor(private router: Router, private _historyService: HistoryService) { }

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
}

import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  send(_order: Order) {
    // register user 
    console.log(_order);
    return this.http.post<boolean>(`${this._apiUrl}/order/send`, _order)
      .pipe(map(orderRecieved => {
        return orderRecieved;
      }));
  }
  
  cancel(_order: Order) {
    // register user 
    console.log(_order);
    return this.http.post<boolean>(`${this._apiUrl}/order/cancel`, _order)
      .pipe(map(orderRecieved => {
        return orderRecieved;
      }));
  }
}

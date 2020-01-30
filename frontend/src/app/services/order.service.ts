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
  private _httpHeader = environment.httpHeader;

  constructor(private http: HttpClient) { }

  send(_order: Order) {
    // register user 
    console.log(_order);
    return this.http.post<boolean>(`${this._apiUrl}/order/send`, _order, this._httpHeader).subscribe(response => {
      if (response != null)
        console.log(response);
      else
        console.log('failed');
      return response;
    });
  }

  edit(_order: Order) {
    // register user 
    console.log(_order);
    return this.http.post<Order>(`${this._apiUrl}/order/edit`, _order, this._httpHeader).subscribe(response => {
      if (response != null)
        console.log(response);
      else
        console.log('failed');
      return response;
    });
  }
}

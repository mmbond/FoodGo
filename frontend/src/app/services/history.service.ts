import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  // All orders
  getOrders(customerId: number) {
      const requestUrl = `${this._apiUrl}/history/all`;
      let params = new HttpParams().set("customerId",customerId.toString());
      return this.http.get<Order[]>(requestUrl, {params: params})
          .pipe(map(response => {
              console.log(response);
              return response;
          }),
          catchError(error => {
              return throwError(error);
          }));
  }
}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Restaurant } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  // All orders
  getOrders(limit: number = 1) {
      const requestUrl = `${this._apiUrl}/history/all`;
      return this.http.get<Order[]>(requestUrl)
          .pipe(map(response => {
              return response;
          }),
          catchError(error => {
              return throwError(error);
          }));
  }

    // add Order comment
    addComment(_order : Order) {
      const requestUrl = `${this._apiUrl}/history/addComment`;
      this.http.post(requestUrl, _order);
      console.log(_order);
    }

     // get Customer favourite Restaurants
    getFavRestaurants(limit: number = 1) {
    const requestUrl = `${this._apiUrl}/history/getFavRestaurants`;
    return this.http.get<Restaurant[]>(requestUrl)
      .pipe(map(response => {
        return response;
      }),
        catchError(error => {
          return throwError(error);
        }));
  }
}
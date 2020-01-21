import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant.model';
import { environment } from '../..//environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  // All restaurants
  getRestaurants(limit: number = 1) {
      const requestUrl = `${this._apiUrl}/restaurant/all`;
      return this.http.get<Restaurant[]>(requestUrl)
          .pipe(map(response => {
              return response;
          }),
          catchError(error => {
              return throwError(error); 
          }));
  }

    // restaurant
    getRestuarant(restaurantId: number) {
      const requestUrl = this._apiUrl + '/restaurant/id';
      let params = new HttpParams().set("restaurantId",restaurantId.toString());
      return this.http.get<Restaurant>(requestUrl, {params: params})
          .pipe(map(response => {
            console.log(response)
              return response;
          }),
          catchError(error => {
              return throwError(error);
          }));
  }
}

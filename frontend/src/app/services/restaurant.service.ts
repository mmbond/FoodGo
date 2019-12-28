import { Injectable } from '@angular/core';
import { Restaurant } from '../models/restaurant.model';
import { environment } from '../..//environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  // All restaurants
  getRestaurants(limit: number = 1) {
      const requestUrl = this._apiUrl + '/restaurant/all';
      return this.http.get<Restaurant[]>(requestUrl)
          .pipe(map(response => {
            console.log(response)
              return response;
          }),
          catchError(error => {
              return throwError(error);
          }));
  }
}

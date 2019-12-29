import { Injectable } from '@angular/core';
import { Meal } from '../models/meal.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Restaurant } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  // All meals
  getMeals(restaurantId: number) {
      const requestUrl = this._apiUrl + '/meal/all';
      let params = new HttpParams().set("restaurantId",restaurantId.toString());
      return this.http.get<Meal[]>(requestUrl, {params: params})
          .pipe(map(response => {
            console.log(response)
              return response;
          }),
          catchError(error => {
              return throwError(error);
          }));
  }
}

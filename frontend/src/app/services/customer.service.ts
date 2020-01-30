import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerProfile } from '../models/customer-profile.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private _apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Post edit customerProfile
  updateCustomer(_customerProfile: CustomerProfile) {
    // TODO videti da li mozda da backend vrati neku potvrdu
    localStorage.setItem('customer', JSON.stringify(_customerProfile));
    return this.http.post<boolean>(`${this._apiUrl}/profile/edit`, _customerProfile)
      .pipe(map(value => {
        return value;
      }));
  }

  // get Customer
  getCustomer() {
    let customer = localStorage.get("customer");
    return JSON.parse(customer);
  }

  // update Customer address
  updateCustomerAddresses(_customerAddresses : Array<String>) {
    const requestUrl = `${this._apiUrl}/profile/modAddresses`;
    this.http.post(requestUrl, _customerAddresses);
    console.log(_customerAddresses);
  }

   // send Customer favourite Restaurants
  updateFavRestaurants(_favRestaurants: Array<String>) {
    const requestUrl = `${this._apiUrl}/profile/modFavRest`;
    return this.http.post(requestUrl, _favRestaurants)
      .pipe(response => {
        return response;
      }),
        catchError(error => {
          return throwError(error);
        });
  }

  // send Customer favourite Meals
  updateFavMeals(_favMeals: Array<String>) {
    const requestUrl = `${this._apiUrl}/profile/modFavFood`;
    return this.http.post(requestUrl, _favMeals)
      .pipe(response => {
        return response;
      }),
        catchError(error => {
          return throwError(error);
        });
  }
}
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerProfile } from '../models/customer-profile.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private _apiUrl = environment.apiUrl;
  private _httpHeader = environment.httpHeader;

  constructor(private http: HttpClient) { }

  // Post edit customerProfile
  updateCustomer(_customerProfile: CustomerProfile) {
    // TODO videti da li mozda da backend vrati neku potvrdu
    localStorage.setItem('customer', JSON.stringify(_customerProfile));
    return this.http.post<boolean>(`${this._apiUrl}/profile/edit`, _customerProfile, this._httpHeader)
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
    this.http.post(requestUrl, _customerAddresses, this._httpHeader).subscribe(response => {
      if (response!=null)
      console.log(response);
      else
      console.log('failed');
    });
  }

   // send Customer favourite Restaurants
  updateFavRestaurants(_favRestaurants: Array<String>) {
    console.log('sent');
    const requestUrl = `${this._apiUrl}/profile/modFavRest`;
    this.http.post(requestUrl, _favRestaurants, this._httpHeader).subscribe(response => {
      if (response!=null)
      console.log(response);
      else
      console.log('failed');
    });
  }

  // send Customer favourite Meals
  updateFavMeals(_favMeals: Array<String>) {
    const requestUrl = `${this._apiUrl}/profile/modFavFood`;
    return this.http.post(requestUrl, _favMeals, this._httpHeader).subscribe(response => {
      if (response!=null)
      console.log(response);
      else
      console.log('failed');
    });
  }
}
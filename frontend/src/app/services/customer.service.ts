import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerProfile } from '../models/customer-profile.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProfileAddressList } from '../models/profile-address-list.model';

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
  getCustomer(limit: number = 1) {
    const requestUrl = `${this._apiUrl}/profile/get`;
    return this.http.get<CustomerProfile>(requestUrl)
      .pipe(response => {
        return response;
      }),
      catchError(error => {
        return throwError(error);
      });
  }

  // get Customer addresses
  getCustomerAddresses(limit: number = 1) {
    const requestUrl = `${this._apiUrl}/profile/getAddresses`;
    return this.http.get<ProfileAddressList>(requestUrl)
      .pipe(map(response => {
        return response;
      }),
        catchError(error => {
          return throwError(error);
        }));
  }

  // update Customer address
  updateCustomerAddresses(_customerAddresses : ProfileAddressList) {
    const requestUrl = `${this._apiUrl}/profile/updateAddresses`;
    this.http.post(requestUrl, _customerAddresses);
    console.log(_customerAddresses);
  }
}
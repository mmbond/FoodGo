import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CustomerProfile } from '../models/customer-profile.model';
import { LoginResponse } from '../models/login-response.model';
import { CustomerRegistration } from '../models/customer-registration.model';
import { CustomerLogin } from '../models/customer-login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentCustomerSubject: BehaviorSubject<CustomerProfile>;
  public currentCustomer: Observable<CustomerProfile>;
  private _apiUrl = environment.apiUrl;
  private _httpHeader = environment.httpHeader;

  constructor(private http: HttpClient) {
    this.currentCustomerSubject = new BehaviorSubject<CustomerProfile>(JSON.parse(localStorage.getItem('customer')));
    this.currentCustomer = this.currentCustomerSubject.asObservable();
  }
  public get currentCustomerValue(): CustomerProfile {
    return this.currentCustomerSubject.value;
  }

  login(_customerLogin: CustomerLogin) {
    return this.http.post<LoginResponse>(`${this._apiUrl}/administration/login`, _customerLogin, this._httpHeader)
      .pipe(map(loginResponse => {
        // login successful if there's a jwt token in the response
        if (Object.entries(loginResponse).length !== 0) { // && customer.token) {
          let customer = loginResponse.customer;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('customer', JSON.stringify(customer));
          this.currentCustomerSubject.next(customer);
        }

        return loginResponse.customer;
      }));
  }

  logout(_customerId: number) {
    // remove user from local storage to log user out
    return this.http.post<boolean>(`${this._apiUrl}/administration/logout`, _customerId, this._httpHeader)
      .pipe(logout => {
        // logout success if true 
        if (logout) {
          // remove user details and jwt token from local storage to logout user
          localStorage.removeItem('customer');
          this.currentCustomerSubject.next(null);
        }
        
        return logout;
      });

  }
  register(_customerRegistration: CustomerRegistration) {
    // register user 
    return this.http.post<LoginResponse>(`${this._apiUrl}/administration/register`, _customerRegistration, this._httpHeader)
      .pipe(map(loginResponse => {
        // register successful if there's a jwt token in the response
        if (Object.entries(loginResponse).length !== 0) { // && customer.token) {
          let customer = loginResponse.customer;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('customer', JSON.stringify(customer));
          this.currentCustomerSubject.next(customer);
        }

        return loginResponse.customer;
      }));
  }
}

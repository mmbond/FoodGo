import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.sass']
})
export class AddressComponent implements OnInit {
  
  addresses: Array<string>;
  error: any;
  constructor(private router: Router, private _customerService: CustomerService) { }

  ngOnInit() {
    this._fetchCustomerAddresses(10);
  }

  private _fetchCustomerAddresses(limit: number = 1) {
    this._customerService.getCustomerAddresses(limit).toPromise()
      .then(response => this.addresses = response.addresses)
      .catch(error => this.error = ErrorHelper.generateErrorObj(error));
  }


  private restaurant() {
    this.router.navigate(['/']);
  }

  public showAddresses() : boolean{
    return this.addresses!=undefined;
  }
}

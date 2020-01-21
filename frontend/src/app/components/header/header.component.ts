import { Component, OnInit } from '@angular/core';
import { CustomerProfile } from 'src/app/models/customer-profile.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  private customerName;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  private login() {
    let customer: CustomerProfile = JSON.parse(localStorage.getItem('customer'));
    if (customer) {
      this.customerName = customer.firstName;
      return true;
    } else {
      return false;
    }
  }

  private logout() {
    let customer: CustomerProfile = JSON.parse(localStorage.getItem('customer'));
    let logout = this.authenticationService.logout(customer.customerId);
    if (logout) {
      this.router.navigate(['/']);
    }
  }
}

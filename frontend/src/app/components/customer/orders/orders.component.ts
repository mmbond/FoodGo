import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public showOrders() : boolean{
    return false;
  }

  private restaurant() {
    this.router.navigate(['/']);
  }

}

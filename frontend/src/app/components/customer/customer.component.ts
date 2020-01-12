import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.sass']
})
export class CustomerComponent implements OnInit {

  tab : string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.tab = this.route.snapshot.data['tab'];
  }


}

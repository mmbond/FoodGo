import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.sass']
})
export class AddressComponent implements OnInit {
  
  // sa API-ja se dobijau adrese dodati u specifikaciju 
  public addresses = ['dasd 12','asdads 12','dasd 12','asdads 12'];
  
  constructor() { }

  ngOnInit() {
  }

  public showAddresses() : boolean{
    return true;
  }
}

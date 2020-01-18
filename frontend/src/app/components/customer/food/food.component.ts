import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.sass']
})
export class FoodComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public showFavourite() : boolean {
    return false;
  }

}

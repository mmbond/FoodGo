import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.sass']
})
export class FavouriteComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public showFavourite() : boolean {
    return false;
  }
}

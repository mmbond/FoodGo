import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';
import { HistoryService } from 'src/app/services/history.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.sass']
})
export class FavouriteComponent implements OnInit {
  favRestaurants: Array<Restaurant>;
  error: any;
  constructor( private _historyService: HistoryService) { }

  ngOnInit() {
    this._fetchFavouriteRestraurants(10);
  }

  private _fetchFavouriteRestraurants(limit: number = 1) {
    this._historyService.getFavRestaurants(limit).toPromise()
      .then(response => this.favRestaurants = response)
      .catch(error => this.error = ErrorHelper.generateErrorObj(error));
  }

  public showFavourite() : boolean {
    return this.favRestaurants != undefined && this.favRestaurants.length != 0;
  }

}

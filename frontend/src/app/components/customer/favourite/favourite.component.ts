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
  total: Array<number>;
  current: number;
  limit = 5; 
  constructor( private _historyService: HistoryService) { }

  ngOnInit() {
    this._fetchFavouriteRestraurants(10);
  }

  private _fetchFavouriteRestraurants(limit: number = 1) {
    //this._historyService.getFavRestaurants(limit).toPromise()
    //  .then(response => {  this.favRestaurants = response; this.total = Array(Math.ceil(response.length / this.limit)); this.current = 1;})
    //  .catch(error => this.error = ErrorHelper.generateErrorObj(error));
  }

  public showFavourite() : boolean {
    return this.favRestaurants != undefined && this.favRestaurants.length != 0;
  }

  public receiveCurrentPage($event) {
    this.current = $event;
    console.log($event);
  }

  public getPageLimit(id: number) {
    return (((this.current - 1) * this.limit) <= id) && (id < (this.current * this.limit));
  }
}

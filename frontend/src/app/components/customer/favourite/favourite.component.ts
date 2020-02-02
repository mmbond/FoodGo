import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';
import { HistoryService } from 'src/app/services/history.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { CustomerProfile } from 'src/app/models/customer-profile.model';
import { ActivatedRoute, Router } from '@angular/router';

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
  returnUrl: string;
  constructor( private route: ActivatedRoute, private router: Router ) { }

  ngOnInit() {
    this._fetchFavouriteRestraurants();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private _fetchFavouriteRestraurants() {
    let customer: CustomerProfile = JSON.parse(localStorage.getItem("customer"));
    this.favRestaurants = customer.fav_restaurants_result;
    if (this.favRestaurants==undefined) {
      this.favRestaurants = [];
    }
    this.total = Array(Math.ceil(this.favRestaurants.length / this.limit));
    this.current = 1;
  }

  public showFavourite() : boolean {
    return this.favRestaurants != undefined && this.favRestaurants.length != 0;
  }

  public receiveCurrentPage($event) {
    this.current = $event;
  }

  public getPageLimit(id: number) {
    return (((this.current - 1) * this.limit) <= id) && (id < (this.current * this.limit));
  }

  public addFavourites() {
    this.router.navigate([this.returnUrl]);
  }
}

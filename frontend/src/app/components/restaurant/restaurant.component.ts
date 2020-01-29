import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./restaurant.component.sass']
})
export class RestaurantComponent implements OnInit {
  restaurants: Array<Restaurant>;
  visibleRestaurants : Array<Restaurant>;
  error : any;
  constructor(private _restaurantService: RestaurantService) { }

  ngOnInit() {
    this._fetchRestaurants(10); 
  }

  private _fetchRestaurants(limit: number = 1) {
    this._restaurantService.getRestaurants(limit).toPromise()
        .then(response => this.restaurants = response)
        .catch(error => this.error = ErrorHelper.generateErrorObj(error));
    }

    private pretraga(event: any) {
      if (event.target.value == '') {
        this.visibleRestaurants = undefined;
        return;
      }
      this.visibleRestaurants = this.restaurants.filter(restaurant=>restaurant.name.toLowerCase().includes(event.target.value.toLowerCase())).slice(0,5);
    }
}

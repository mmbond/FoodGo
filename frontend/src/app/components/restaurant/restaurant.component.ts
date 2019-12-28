import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./restaurant.component.sass']
})
export class RestaurantComponent implements OnInit {
  @Input() data: any;
  constructor(private _restaurantService: RestaurantService) { }

  ngOnInit() {
    this._fetchRestaurants(10); 
  }

  private _fetchRestaurants(limit: number = 1) {
    this._restaurantService.getRestaurants(limit).toPromise()
        .then(response => this.data = { result: response, error: null})
        .catch(error => this.data = { result: null, error: ErrorHelper.generateErrorObj(error)});
    }

}

import { Component, OnInit } from '@angular/core';
import { Meal } from 'src/app/models/meal.model';
import { HistoryService } from 'src/app/services/history.service';
import { ErrorHelper } from 'src/app/utilities/ErrorHelper';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.sass']
})
export class FoodComponent implements OnInit {

  favMeals: Array<Meal>;
  error: any;
  constructor( private _historyService: HistoryService) { }

  ngOnInit() {
    this._fetchFavouriteMeals(10);
  }

  private _fetchFavouriteMeals(limit: number = 1) {
    this._historyService.getFavMeals(limit).toPromise()
      .then(response => this.favMeals = response)
      .catch(error => this.error = ErrorHelper.generateErrorObj(error));
  }

  public showFavourite() : boolean {
    return this.favMeals != undefined && this.favMeals.length != 0;
  }
}
 
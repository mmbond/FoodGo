import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HistoryService } from 'src/app/services/history.service';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.sass']
})
export class RatingComponent implements OnInit {
  @Input() currentRate: number;
  @Input() read: boolean;
  @Input() restaurant: Restaurant;

  constructor( private _historyService: HistoryService) { }

  ngOnInit() {
  }

  private rateOrder(rate : number) {
    if (rate==0) {
      return true;
    }
    var restaurant = this.restaurant;
    restaurant.mark = rate;
    this._historyService.rateOrder(restaurant);
    return false;
  }
}

import { Component, OnInit, Input} from '@angular/core';
import { HistoryService } from 'src/app/services/history.service';
import { Status } from 'src/app/models/status.model';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.sass']
})
export class RatingComponent implements OnInit {
  @Input() currentRate: number;
  @Input() read: boolean;
  @Input() order: Order;

  constructor( private _historyService: HistoryService) { }

  ngOnInit() {
  }

  private rateOrder(rate : number) {
    if (rate==0) {
      return true;
    }
    this.order.mark = rate;
    this._historyService.rateOrder(this.order);
    return false;
  }
}

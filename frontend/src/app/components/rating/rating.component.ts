import { Component, OnInit, Input} from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.sass']
})
export class RatingComponent implements OnInit {
  @Input() currentRate: number;
  @Input() read: boolean;
  @Input() order: Order;

  constructor( private _orderService: OrderService) { }

  ngOnInit() {
  }

  private rateOrder(rate : number) {
    if (rate==0) {
      return true;
    }
    this.order.mark = rate;
    this._orderService.edit(this.order);
    return false;
  }
}

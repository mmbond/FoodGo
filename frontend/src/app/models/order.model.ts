import { Restaurant } from './restaurant.model'
import { Meal } from './meal.model';
import { Status } from './status.model';

export class Order {
    orderId: number;
    restaurant: Restaurant;
    status: Status;
    meals: Array<Meal>;
    comment: string;
    orderDate: Date;
    price: number;
    note: string;
    mark: number;
}

import { Restaurant } from './restaurant.model'
import { Meal } from './meal.model';

export class Order {
    orderId: number;
    restaurant: Restaurant;
    status: string;
    meals: Array<Meal>;
    comment: string;
    orderDate: Date;
    price: number;
    note: string;
}

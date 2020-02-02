import { Restaurant } from './restaurant.model'
import { Meal } from './meal.model';
import { Status } from './status.model';

export class Order {
    orderId: number;
    customerId: number;
    restaurant: Restaurant;
    restaurantId: number;
    address: string;
    status: Status;
    meals: Array<Meal>;
    comment: string;
    timestamp: Date;
    price: number;
    notes: string;
    mark: number;
    meals_ids: string;
    meal_ingredients_ids: string;
    meal_count: string;
}
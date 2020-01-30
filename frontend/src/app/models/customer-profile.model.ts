import { Restaurant } from './restaurant.model';
import { Meal } from './meal.model';

export class CustomerProfile {

    address: String;
    customerId: number;
    email: string;
    fav_meals: Array<string>;
    fav_restaurants: Array<string>;
    firstName: string;
    lastName: string;
    phone: string;
    fav_restaurants_result: Array<Restaurant>;
    fav_meals_result: Array<Meal>;
}

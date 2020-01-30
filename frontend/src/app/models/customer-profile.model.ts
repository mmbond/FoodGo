import { Restaurant } from './restaurant.model';

export class CustomerProfile {

    address: String;
    customerId: number;
    email: string;
    fav_food: Array<string>;
    fav_restaurants: Array<string>;
    firstName: string;
    lastName: string;
    phone: string;
    fav_restaurants_result: Array<Restaurant>;
}

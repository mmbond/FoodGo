import { Meal } from './meal.model';

export class Restaurant {
    
    restaurantId: number;
    name: string;
    restaurantLogo: string;
    description: string;
    mark: number;
    address: string;
    meals: Array<Meal>;
}

import { Ingredients } from './ingredients.model';

export class Meal {

    mealId: number;
    name: string;
    mealPicture: string;
    description: string;
    category: any;
    price: number;
    ingredients: Array<Ingredients>;
}

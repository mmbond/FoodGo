# Autentikacija

## CustomerLogin
| Naziv atributa | Tip            |
|----------------|----------------|
| email          | String         |
| password       | String(SHA256) |

## CustomerRegistration
| Naziv atributa | Tip            |
|----------------|----------------|
| address        | String         |
| email          | String         |
| firstName      | String         |
| lastName       | String         |
| phone          | String         |
| password       | String(SHA256) |

## LoginResponse
| Naziv atributa | Tip                                 |
|----------------|-------------------------------------|
| customer       | [CustomerProfile](#customerprofile) |

## CustomerProfile
| Naziv atributa         | Tip                             |
|------------------------|---------------------------------|
| addresses              | List<String>                    |
| customerId             | Long                            |
| email                  | String                          |
| fav_meals              | List<String>                    |
| fav_restaurants        | List<String>                    |
| firstName              | String                          |
| lastName               | String                          |
| password               | String(SHA256)                  |
| phone                  | String                          |
| fav_restaurants_result | List<[Restaurant](#restaurant)> |
| fav_meals_result       | List([Meal](#Meal))             |

# Operativni rad aplikacije

## Restaurant
| Naziv atributa | Tip                   |
|----------------|-----------------------|
| restaurantId   | Long                  |
| name           | String                |
| restaurantLogo | String                |
| description    | String                |
| work_time      | String                |
| mark           | Long                  |
| address        | String                |
| meals          | List< [Meal](#meal) > |

## Meal
| Naziv atributa | Tip                               |
|----------------|-----------------------------------|
| mealId         | Long                              |
| name           | String                            |
| mealPicture    | String                            |
| description    | String                            |
| category       | String                            |
| price          | Long                              |
| ingredients    | List([Ingredients](#ingredients)) |

## Order
| Naziv atributa       | Tip                   |
|----------------------|-----------------------|
| orderId              | Long                  |
| customerId           | Long                  |
| restaurantId         | Long                  |
| address              | String                |
| status               | [Status](#status)     |
| meals                | List< [Meal](#meal) > |
| comment              | String                |
| timestamp            | Date                  |
| price                | Long                  |
| notes                | String                |
| mark                 | Integer               |
| meals_ids            | String                |
| meal_ingredients_ids | JSON                  |
| meal_count           | String                |


## Ingredients
| Naziv atributa | Tip    |
|----------------|--------|
| ingredientId   | Long   |
| name           | String |
| price          | Long   |

## Category
| Vrednosti    |
|--------------|
# TODO srediti ovo

## Status
| Naziv atributa | Tip    | Vrednosti   |
|----------------|--------|-------------|
| FINISHED       | String | finished    |
| IN PROGRESS    | String | in progress |
| CANCELED       | String | canceled    |

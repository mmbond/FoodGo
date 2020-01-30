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
| Naziv atributa | Tip    |
|----------------|--------|
| restaurantId   | Long   |
| name           | String |
| restaurantLogo | String |
| description    | String |
| work_time      | String |
| mark           | Long   |
| address        | String |

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
| Naziv atributa | Tip                       |
|----------------|---------------------------|
| orderId        | Long                      |
| restaurant     | [Restaurant](#restaurant) |
| status         | [Status](#status)         |
| meals          | List< [Meal](#meal) >     |
| comment        | String                    |
| orderDate      | Date                      |
| price          | Long                      |
| note           | String                    |
| mark           | Integer                   |

## Ingredients
| Naziv atributa | Tip    |
|----------------|--------|
| ingridientsId  | Long   |
| name           | String |
| price          | Long   |
<<<<<<< HEAD
| mealId         | Long   |
=======

## Category
| Vrednosti    |
|--------------|
# TODO srediti ovo
>>>>>>> 34393624598bee0e56c6b45d895d072a020ab6d2

## Status
| Naziv atributa | Tip    | Vrednosti   |
|----------------|--------|-------------|
| FINISHED       | String | finished    |
| IN PROGRESS    | String | in progress |
| CANCELED       | String | canceled    |

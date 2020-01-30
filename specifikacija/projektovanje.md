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
| fav_food               | List<String>                    |
| fav_restaurants        | List<String>                    |
| firstName              | String                          |
| lastName               | String                          |
| password               | String(SHA256)                  |
| phone                  | String                          |
| fav_restaurants_result | List<[Restaurant](#restaurant)> |

# Operativni rad aplikacije

## Restaurant
| Naziv atributa | Tip    |
|----------------|--------|
| restaurantId   | Long   |
| name           | String |
| restaurantLogo | String |
| description    | String |
| mark           | Long   |
| address        | String |

## Meal
| Naziv atributa | Tip                               |
|----------------|-----------------------------------|
| mealId         | Long                              |
| name           | String                            |
| mealPicture    | String                            |
| description    | String                            |
| category       | [Category](#category)             |
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

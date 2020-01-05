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
| Naziv atributa | Tip            |
|----------------|----------------|
| address        | String         |
| customerId     | Long           |
| email          | String         |
| favoriteMeals  | List< String > |
| firstName      | String         |
| lastName       | String         |
| phone          | String         |


# Operativni rad aplikacije

## Restaurant
| Naziv atributa | Tip    |
|----------------|--------|
| restaurantId   | Long   |
| name           | String |
| restorantLogo  | String |
| description    | String |
| mark           | Long   |
| address        | String |

## Meal
| Naziv atributa | Tip                                 |
|----------------|-------------------------------------|
| mealId         | Long                                |
| name           | String                              |
| mealPicture    | String                              |
| description    | String                              |
| category       | Enum                                |
| price          | Long                                |
| ingredients    | List< [Ingredients](#ingredients) > |

## Order
| Naziv atributa | Tip                       |
|----------------|---------------------------|
| orderId        | Long                      |
| restaurant     | [Restaurant](#restaurant) |
| status         | [Status](#status)         |
| meals          | List< [Meal](#meal) >     |
| description    | String                    |
| orderDate      | Date                      |
| price          | Long                      |
| note           | String                    |

## Ingredients
| Naziv atributa | Tip    |
|----------------|--------|
| ingridientsId  | Long   |
| name           | String |
| price          | Long   |

## Status
| Vrednosti |
|-----------|
| Finished  |
| Current   |
| Canceled  |

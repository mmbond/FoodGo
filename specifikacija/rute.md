> rute počinju sa `api/administration/`
## Autentikacija
| Ruta     | Metoda | In                   | Out           |
|----------|--------|----------------------|---------------|
| login    | POST   | CustomerLogin        | LoginResponse |
| logout   | POST   | CustomerId (long)    |               |
| register | POST   | CustomerRegistration | LoginResponse |


> rute počinju sa `api/profile/`
## Autentikacija
| Ruta | Metoda | In                | Out             |
|------|--------|-------------------|-----------------|
| edit | POST   | CustomerProfile   |                 |
| get  | POST   | CustomerId (long) | CustomerProfile |


> rute počinju sa `api/restaurant/`
## Restaurant
| Ruta | Metoda | In                  | Out                |
|------|--------|---------------------|--------------------|
| all  | GET    |                     | List< Restaurant > |
| id   | GET    | RestaurantId (long) | Restaurant         |


> rute počinju sa `api/meal/`
## Meal
| Ruta | Metoda | In                  | Out          |
|------|--------|---------------------|--------------|
| all  | GET    | RestaurantId (long) | List< Meal > |
| id   | GET    | MealId (long)       | Meal         |


> rute počinju sa `api/order/`
## Order
| Ruta | Metoda | In                  | Out        |
|------|--------|---------------------|------------|
| send | POST   | Order               | boolean    |
<!-- | id   | GET    | RestaurantId (long) | Restaurant | -->


> rute počinju sa `api/history/`
## History
| Ruta | Metoda | In                  | Out           |
|------|--------|---------------------|---------------|
| all  | GET    | CustomerId          | List< Order > |
<!-- | id   | GET    | RestaurantId (long) | Restaurant    | -->
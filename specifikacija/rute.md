## Autentikacija
> rute počinju sa `api/administration/`

| Ruta     | Metoda | In                   | Out           |
|----------|--------|----------------------|---------------|
| login    | POST   | CustomerLogin        | LoginResponse |
| logout   | POST   | CustomerId (Long)    | Boolean       |
| register | POST   | CustomerRegistration | LoginResponse |


## Profil
> rute počinju sa `api/profile/`

| Ruta         | Metoda | In                | Out                |
|--------------|--------|-------------------|--------------------|
| edit         | POST   | CustomerProfile   |                    |
| get          | GET    | CustomerId (long) | CustomerProfile    |
| getAddresses | GET    | CustomerId (long) | ProfileAddressList |


## Restaurant
> rute počinju sa `api/restaurant/`

| Ruta | Metoda | In                  | Out                |
|------|--------|---------------------|--------------------|
| all  | GET    |                     | List< Restaurant > |
| id   | GET    | RestaurantId (long) | Restaurant         |


## Meal
> rute počinju sa `api/meal/`

| Ruta | Metoda | In                  | Out          |
|------|--------|---------------------|--------------|
| all  | GET    | RestaurantId (long) | List< Meal > |
| id   | GET    | MealId (long)       | Meal         |


## Order
> rute počinju sa `api/order/`

| Ruta | Metoda | In                  | Out        |
|------|--------|---------------------|------------|
| send | POST   | Order               | boolean    |
<!-- | id   | GET    | RestaurantId (long) | Restaurant | -->


## History
> rute počinju sa `api/history/`

| Ruta | Metoda | In                  | Out           |
|------|--------|---------------------|---------------|
| all  | GET    | CustomerId          | List< Order > |
<!-- | id   | GET    | RestaurantId (long) | Restaurant    | -->
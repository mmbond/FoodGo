import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { MealComponent } from './components/meal/meal.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: RestaurantComponent },
  { path: 'restaurant', component: RestaurantComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'restaurant/:restaurantId', component: MealComponent },
  {
    path: '',
    redirectTo: 'restaurant',
    pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

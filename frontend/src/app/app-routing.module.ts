import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerComponent } from './components/customer/customer.component';

const routes: Routes = [
  { path: '', component: RestaurantComponent },
  { path: 'restaurant', component: RestaurantComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'customer/profile', component: CustomerComponent, data : {tab : 'profile'}},
  { path: 'customer/address', component: CustomerComponent, data : {tab : 'address'}},
  { path: 'customer/favourite', component: CustomerComponent, data : {tab : 'favourite'}},
  { path: 'customer/comment', component: CustomerComponent, data : {tab : 'comment'}},
  { path: 'customer/orders', component: CustomerComponent, data : {tab : 'orders'}},
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

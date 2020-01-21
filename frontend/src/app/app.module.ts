import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { ScrollComponent } from './components/scroll/scroll.component';
import { RatingComponent } from './components/rating/rating.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MealComponent } from './components/meal/meal.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { OrderComponent } from './components/order/order.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ProfileComponent } from './components/customer/profile/profile.component';
import { AddressComponent } from './components/customer/address/address.component';
import { FavouriteComponent } from './components/customer/favourite/favourite.component';
import { CommentComponent } from './components/customer/comment/comment.component';
import { OrdersComponent } from './components/customer/orders/orders.component';
import { FoodComponent } from './components/customer/food/food.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RestaurantComponent,
    ScrollComponent,
    RatingComponent,
    MealComponent,
    RegisterComponent,
    LoginComponent,
    OrderComponent,
    CustomerComponent,
    ProfileComponent,
    AddressComponent,
    FavouriteComponent,
    CommentComponent,
    OrdersComponent,
    FoodComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

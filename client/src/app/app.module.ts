import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule }    from '@angular/http';
import {HttpClientModule} from '@angular/common/http';

import { FormsModule }    from '@angular/forms';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';

import { AuthenticationService, UserService ,AuthGuard} from './_services/index';


import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { LeftComponent } from './left/left.component';
import { RightComponent } from './right/right.component';
import { OrdersComponent } from './right/orders/orders.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StrategyComponent } from './right/strategy/strategy.component';
import { AlertsComponent } from './right/alerts/alerts.component';
import { SharesComponent } from './right/shares/shares.component';

const appRoutes: Routes = [
  //{ path: '', redirectTo: '/orders', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent,
    children: [
      {path: '', redirectTo: 'orders' ,pathMatch:"full"},
      { path: 'orders', component: OrdersComponent },
      { path: 'strategies', component: StrategyComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'shares', component: SharesComponent },
    ],
   canActivate: [AuthGuard]
 },
  { path: '**', redirectTo: '' }
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LeftComponent,
    RightComponent,
    OrdersComponent,
    NavbarComponent,
    StrategyComponent,
    AlertsComponent,
    SharesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
     HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
     AuthGuard,
     AuthenticationService,
     UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

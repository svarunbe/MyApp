import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule }    from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { LeftComponent } from './left/left.component';
import { RightComponent } from './right/right.component';
import { OrdersComponent } from './right/orders/orders.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StrategyComponent } from './right/strategy/strategy.component';
import { AlertsComponent } from './right/alerts/alerts.component';
import { SharesComponent } from './right/shares/shares.component';

const appRoutes: Routes = [
  //{ path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'orders', component: OrdersComponent },
  { path: 'strategies', component: StrategyComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: '', component: SharesComponent }
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
     HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent{
	result = [];
  	constructor(http: Http) {

    http.post('/shares',{})
      .subscribe(
        result => {
            this.result =result.json().data;
      },
      error => {
        console.log("somethig wend wrong");
      }
      )

  }

}

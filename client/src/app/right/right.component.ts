import { Component, OnInit } from '@angular/core';
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})
export class RightComponent implements OnInit {
  private socket;
  constructor() { }

  ngOnInit() {
  	this.socket = io.connect();
  	//this.socket.emit('add-message', "message");    
  	this.socket.on('news', (data) => {
        console.log(data);
      }); 
  }
}

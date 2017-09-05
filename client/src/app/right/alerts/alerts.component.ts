import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
@Injectable()
// export class ChatService {
//   private url = 'http://localhost:5000';  
//   private socket;
  
//   sendMessage(message){
//     this.socket.emit('add-message', message);    
//   }
  
//   getMessages() {
//     let observable = new Observable(observer => {
//       this.socket = io(this.url);
//       this.socket.on('message', (data) => {
//         observer.next(data);    
//       });
//       return () => {
//         this.socket.disconnect();
//       };  
//     })     
//     return observable;
//   }  
// }
export class AlertsComponent implements OnInit {
	
  constructor() { }

  ngOnInit() {
  	 
  }

}

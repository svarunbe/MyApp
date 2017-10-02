import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router  } from '@angular/router';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.css']
})
export class SharesComponent implements OnInit {
 sub:any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,private http: HttpClient) {
  	http.get('/orders/request_token')
		      // Call map on the response observable to get the parsed people object
		      .success(res => console.log(res))
		      .error(err => console.log(err))
  }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
      	
      	if(params.status=="success"){
		   	   
		      
		  }	   	
      	}
        // Defaults to 0 if no query param provided.
        //this.page = +params['page'] || 0;
      });
  }
}

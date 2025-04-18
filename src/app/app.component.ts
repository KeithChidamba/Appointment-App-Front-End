import { Component,OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from 'node_modules/@angular/router';
import { AppointmentService } from './services/appointment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth:AuthService,private router:Router,public apmt:AppointmentService){}
  ngOnInit(){
    this.apmt.BusinessSelected=this.auth.loggedIn();
  }
  Logout(){
    this.auth.Logout();
    this.router.navigate(['']);
    this.auth.isLoggedIn = false;
  }
}

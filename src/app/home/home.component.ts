import { Component,OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from 'node_modules/@angular/router';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private apmt:AppointmentService,private auth:AuthService,public router:Router){}
  Businessname='';

  SearchForBusiness(){
    this.apmt.SelectedBusinessForClientView = this.Businessname;
    this.apmt.BusinessSelected = true;
    this.router.navigate(['/AppointmentsTimetable']);
  }
}

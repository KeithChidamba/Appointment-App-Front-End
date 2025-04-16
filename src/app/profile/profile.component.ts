import { Component,OnInit,Injectable } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { LoginData } from '../interfaces/LoginData';
import { Business } from '../models/Business';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ProfileComponent {
  constructor(public auth:AuthService, private apntment:AppointmentService) {}
  BusinessOwner: Business = new Business(0, '', '', '', '', '', '');
ngOnInit() {
      this.auth.OnAuth.subscribe((AuthByLogin)=>{
          if(AuthByLogin){
            this.auth.getBusinessData().subscribe(
              (info)=>{
                this.load_user_info(info);
              })
          }else{
            this.load_user_info(this.auth.getBusinessDataFromRegister());
          }
      })
}
load_user_info(info:Business){
  this.BusinessOwner.BusinessName = info.BusinessName;
  this.BusinessOwner.OwnerFirstName = info.OwnerFirstName;
  this.BusinessOwner.OwnerLastName = info.OwnerLastName;
  this.BusinessOwner.OwnerEmail = info.OwnerEmail;
  this.BusinessOwner.OwnerPhone = info.OwnerPhone;
  this.BusinessOwner.OwnerPassword = info.OwnerPassword;
  this.apntment.RecieveData(this.BusinessOwner);
}
}

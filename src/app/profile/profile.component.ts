import { Component,OnInit,Injectable } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Business } from '../interfaces/Business';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ProfileComponent {
  BusinessOwner:Business={
    OwnerEmail: ' ',
    OwnerPassword:'',
    BusinessName: '',
    BusinessID:'',
    OwnerFirstName:'',
    OwnerLastName:'',
    OwnerPhone:''
  };
loaded = false;
number_of_Tasks = 0;
constructor(public auth:AuthService){}
ngOnInit(){
  if(!this.loaded){
    this.auth.getProfile().subscribe(
      (profile)=>{
        this.load_user_info(profile)
      }
    )
  }
}
load_user_info(info:any){
    this.BusinessOwner.BusinessName =JSON.stringify(info.name).slice(1, -1);
    this.BusinessOwner.OwnerEmail=JSON.stringify(info.email).slice(1, -1);
    this.loaded = true;
}
}

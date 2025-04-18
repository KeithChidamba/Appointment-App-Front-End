import { Component } from '@angular/core';
import { Validators,FormBuilder } from "node_modules/@angular/forms";
import { AuthService } from "../services/auth.service";
import { LoginData }from '../interfaces/LoginData';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private apmt: AppointmentService,private fb: FormBuilder,public auth:AuthService) { } 
  err = false;
  success = false;
  checkingValidity =false;
  errorAlert='';
  BusinessOwner:LoginData={
      BusinessName: '',
      OwnerPassword:''
      ,OwnerEmail: ' '
  };
    Loginform = this.fb.group({
      BusinessName : ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ])],
      OwnerPassword : ['', Validators.compose([
        Validators.minLength(8),
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.maxLength(30),
        Validators.required
      ])],
      OwnerEmail : ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(30),
        Validators.required,
        Validators.email
      ])]
    });

    checkValidity(){
      this.checkingValidity = true;
      if(this.Loginform.valid){
        this.BusinessOwner.OwnerPassword = this.Loginform.get('OwnerPassword')?.value;
        this.BusinessOwner.BusinessName = this.Loginform.get('BusinessName')?.value;
        this.BusinessOwner.OwnerEmail = this.Loginform.get('OwnerEmail')?.value;
        this.auth.login(this.BusinessOwner).subscribe(
          (data)=>{
            this.auth.StoreToken(data);
            this.auth.LoadToken();
            this.auth.loggedIn();
            this.apmt.BusinessSelected=true;
            this.auth.GetBusinessData();
            this.success = true;
            this.err = false;
          },
          (error)=>{
              this.err = true;
              this.errorAlert = error;

          }
        )
      }
    }
  }

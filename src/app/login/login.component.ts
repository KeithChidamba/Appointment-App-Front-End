import { Component,Injectable } from '@angular/core';
import { Validators,FormBuilder } from "node_modules/@angular/forms";
import { Business } from "../interfaces/Business";
import { AuthService } from "../services/auth.service";
import { Router } from 'node_modules/@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  constructor(private fb: FormBuilder,public auth:AuthService,private router:Router) { } 
  err = false;
  success = false;
  checkingValidity =false;
  errorAlert='';
  BusinessOwner:Business={
    OwnerEmail: ' ',
    OwnerPassword:'',
    BusinessName: '',
    BusinessID:'',
    OwnerFirstName:'',
    OwnerLastName:'',
    OwnerPhone:''
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
      ])]
    });
    checkValidity(){
      this.checkingValidity = true;
      if(this.Loginform.valid){
        this.BusinessOwner.OwnerPassword = this.Loginform.get('OwnerPassword')?.value;
        this.BusinessOwner.BusinessName =this.Loginform.get('BusinessName')?.value;
        this.auth.login(this.BusinessOwner).subscribe(
          (data)=>{
            this.auth.StoreToken(data);
            this.auth.LoadToken();
            this.auth.loggedIn();
            this.success = true;
            this.err = false;
            setTimeout(()=>{
                this.router.navigate(['/dashboard'])
            },500)
            this.router 
          },
          (error)=>{
              this.err = true;
              this.errorAlert = error;

          }
        )
      }
    }
  }

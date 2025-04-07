import { Component,Injectable } from '@angular/core';
import { Validators,FormBuilder } from "node_modules/@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from 'node_modules/@angular/router';
import { Business } from '../models/Business';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class RegisterComponent {
  constructor(private fb: FormBuilder,public auth:AuthService,private router:Router) { } 
  errorAlert='';
  checkingValidity =false;
  err = false;
  success = false;
  BusinessOwner:Business={
    BusinessID:0,
    OwnerEmail: ' ',
    OwnerPassword:'',
    BusinessName: '',
    OwnerFirstName:'',
    OwnerLastName:'',
    OwnerPhone:''
  };
    SignUpform = this.fb.group({
      BusinessName : ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ])],
      OwnerEmail : ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(30),
        Validators.required,
        Validators.email
      ])],
      OwnerPassword : ['', Validators.compose([
        Validators.minLength(8),
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.maxLength(30),
        Validators.required
      ])],
      OwnerPhone : ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{10}$') 
      ])],
      OwnerFirstName : ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ])],
      OwnerLastName : ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ])]
    });
    checkValidity(){
      this.checkingValidity = true;
      if(this.SignUpform.valid){
        this.BusinessOwner = {
          OwnerEmail: this.SignUpform.get('OwnerEmail')?.value as string,
          OwnerPassword:this.SignUpform.get('OwnerPassword')?.value as string,
          BusinessName: this.SignUpform.get('BusinessName')?.value as string,
          OwnerPhone:this.SignUpform.get('OwnerPhone')?.value as string,
          OwnerFirstName:this.SignUpform.get('OwnerFirstName')?.value as string,
          OwnerLastName:this.SignUpform.get('OwnerLastName')?.value as string,
          BusinessID:0
        }
        this.auth.register(this.BusinessOwner).subscribe(
          (data)=>{
            this.auth.UserValidated=true;
            this.err = false;
            this.success=true;
            setTimeout(()=>{
                this.router.navigate([''])
            },500)
          },
          (error)=>{
              this.err = true;
              this.errorAlert = error;
          }
        )
        };
    }
}
    


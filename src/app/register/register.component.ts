import { Component,Injectable } from '@angular/core';
import { Validators,FormBuilder } from "@angular/forms";
import { User } from "../interfaces/userInt";
import { AuthService } from "../services/auth.service";
import { Router } from '@angular/router';

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
  user:User={
    email: '',
    password:'',
    username: ''
  };
    SignUpform = this.fb.group({
      username : ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ])],
      email : ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(30),
        Validators.required,
        Validators.email
      ])],
      password : ['', Validators.compose([
        Validators.minLength(8),
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.maxLength(30),
        Validators.required
      ])]
    });
    checkValidity(){
      this.checkingValidity = true;
      if(this.SignUpform.valid){
        this.user = {
          email: this.SignUpform.get('email')?.value,
          password:this.SignUpform.get('password')?.value,
          username: this.SignUpform.get('username')?.value
        }
        this.auth.register(this.user).subscribe(
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
    


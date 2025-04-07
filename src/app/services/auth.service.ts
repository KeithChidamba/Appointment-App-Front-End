import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent} from "@angular/common/http";
import { Business } from '../interfaces/Business';
import { catchError,throwError} from 'rxjs';
import { JwtHelperService } from "node_modules/@auth0/angular-jwt";
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public http:HttpClient,public dp:DatePipe) { }
  UserValidated = false;
  helper = new JwtHelperService();
  //domain = "https://nail-appointment-backend-production.up.railway.app";
  domain = "http://localhost:8080";
  isLoggedIn = false;
  options:any;
  authToken:any;
     register(BusinessOwner:Business) {
          return this.http.post<Business>(this.domain+ '/auth/register',BusinessOwner).pipe(  
            catchError(this.handleError)
          )
    }
     login(BusinessOwner:Business) {
          return this.http.post<Business>(this.domain+ '/auth/login',BusinessOwner).pipe(  
            catchError(this.handleError)
          )
    }
    createAuthenticationHeaders(){
        this.LoadToken();
        this.options = {
          headers: new HttpHeaders({
            'Content-Type':'application/json',
            'authorization':this.authToken
        })}
    }
    getProfile(){
      this.createAuthenticationHeaders();
      return this.http.get(this.domain+ '/authentication/profile',this.options);
    }
    LoadToken(){
      this.authToken = localStorage.getItem('Token_id');

    }
    StoreToken(BusinessOwner:Business){
       localStorage.setItem('Token_id',JSON.stringify(BusinessOwner).slice(1, -1));
    }
    Logout(){
        localStorage.clear();
        this.authToken = null;
    }
    loggedIn(){
      let current_date = this.dp.transform((new Date),'MM/dd/yyyy h:mm:ss');
      let token_date = this.helper.getTokenExpirationDate(this.authToken);
      if(token_date!=undefined&&current_date!=null){
            if(token_date.toDateString()>current_date){
                this.isLoggedIn =true;
            }else{
              this.isLoggedIn =false;
            }
          }
      return this.isLoggedIn
    }
    private handleError(error: HttpErrorResponse) {
      if (error.status==426){

        console.error('no token',error.error);
      }
      if (error.status==427){

        console.error('token invalid',error.error);
      }
      if (error.status==400){
        console.error("login error");
      }
      if (error.status==0){
        console.error('An error occurred:header already sent to client', error.error);
      }
      if (error.status==421){

        console.error('Username not Found',error.error);
      }
      if (error.status==423){

        console.error('Password Invalid',error.error);
      }
      if (error.status==422){

        console.error('USER EXISTS!', error.error);
      }
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      return throwError(() => new Error(error.error));
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent} from "@angular/common/http";
import { catchError,throwError} from 'rxjs';
import { JwtHelperService } from "node_modules/@auth0/angular-jwt";
import { DatePipe } from '@angular/common';
import { LoginData } from '../interfaces/LoginData';
import { Business } from '../models/Business';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public http:HttpClient,public dp:DatePipe) { }
  private helper = new JwtHelperService();
  //private domain = "https://nail-appointment-backend-production.up.railway.app";
  private domain = "http://localhost:8080";
  public isLoggedIn = false;
  private authToken:string ='';

     register(BusinessOwner:Business) {
          return this.http.post<Business>(this.domain+ '/api/auth/register',BusinessOwner).pipe(  
            catchError(this.handleError)
          )
    }
     login(BusinessOwner:LoginData) {
          return this.http.post<string>(this.domain+ '/api/auth/login',BusinessOwner).pipe(  
            catchError(this.handleError)
          )
    }
    createAuthenticationHeaders(){
      this.LoadToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
      });
      return headers;
    }
    getBusinessData(){
      const headers = this.createAuthenticationHeaders();
      return this.http.get<Business>(this.domain+ '/api/auth/GetBusinessData',{headers}).pipe(  
        catchError(this.handleError)
      )
    }
    LoadToken(){
      var token = localStorage.getItem('Token_id') as string;
      if(token==null)return;
      var tokenJSON = JSON.parse(token);
      this.authToken = tokenJSON.token;
    }
    StoreToken(token:string){
       localStorage.setItem('Token_id',JSON.stringify(token));
    }
    Logout(){
        localStorage.clear();
        this.authToken = '';
    }
    loggedIn(){
      this.LoadToken();
      let current_date = this.dp.transform((new Date),'MM/dd/yyyy h:mm:ss');
      let token_date = this.helper.getTokenExpirationDate(this.authToken);
      if(token_date!=undefined&&current_date!=null){
            if(token_date.toDateString()>current_date){
                this.isLoggedIn =true;
            }else{
              this.isLoggedIn =false;
            }
          }else return false;
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

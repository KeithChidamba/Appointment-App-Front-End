import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import { catchError,Subject,throwError} from 'rxjs';
import { JwtHelperService } from "node_modules/@auth0/angular-jwt";
import { DatePipe } from '@angular/common';
import { LoginData } from '../interfaces/LoginData';
import { Business } from '../models/Business';
import { Router } from 'node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public http:HttpClient,public dp:DatePipe,private router:Router) { }
  private helper = new JwtHelperService();
  private domain = "https://nail-appointment-backend-production.up.railway.app";
  //private domain = "http://localhost:8080";
  public isLoggedIn = false;
  private authToken:string ='';
  public BusinessData:Business=new Business(0,' ','','', '','','' );
  public OnLogout: Subject<void> = new Subject<void>();

GetBusinessData(){
    this.getBusinessData().subscribe(
      (info)=>{
        this.BusinessData=info;
        this.router.navigate(['/Profile'])
      })
}
     register(BusinessOwner:Business) {
      this.BusinessData=BusinessOwner;
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
    private getBusinessData(){
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
        this.OnLogout.next();
    }
    loggedIn(){
      this.LoadToken();
      const currentDate = new Date();
      const tokenDate = this.helper.getTokenExpirationDate(this.authToken);
      return  (tokenDate instanceof Date)? this.isLoggedIn = tokenDate > currentDate : false;
    }
    private handleError(error: HttpErrorResponse) {
      console.error(error.message);
      return throwError(() => new Error(error.error));
    }
}

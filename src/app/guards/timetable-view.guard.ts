import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimetableViewGuard implements CanActivate {
  constructor(private auth:AuthService,private apmt:AppointmentService,private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.auth.OnLogout.subscribe(()=>{
      this.apmt.BusinessSelected=false;
    });
    if(!this.apmt.BusinessSelected){this.router.navigate(['']);}
    return this.apmt.BusinessSelected;
  }
  
}

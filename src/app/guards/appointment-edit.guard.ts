import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppointmentService } from '../services/appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentEditGuard implements CanActivate {
  constructor(private apmnt:AppointmentService,private router:Router){}
  AppointmentSelected=false;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.apmnt.OnAppointmentSelected.subscribe((Selected)=>{
        this.AppointmentSelected = Selected;
      });
      if(!this.AppointmentSelected){this.router.navigate(['/AppointmentsTimetable']);}
      return this.AppointmentSelected;
  }
  
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppointmentService } from '../services/appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentBookingGuard implements CanActivate {
  BlankSlotSelected=false;
  constructor(private apmnt:AppointmentService,private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.apmnt.OnBlankSlotSelected.subscribe((Selected)=>{
        this.BlankSlotSelected = Selected;
      });
      if(!this.BlankSlotSelected){this.router.navigate(['/AppointmentsTimetable']);}
      return this.BlankSlotSelected;
  }
  
}

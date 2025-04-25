import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, timeout, catchError, map } from 'rxjs';
import { AppointmentService } from '../services/appointment.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentBookingGuard implements CanActivate {

  constructor(private apmnt: AppointmentService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.apmnt.OnBlankSlotSelected.pipe(
      timeout(1000),
      map(selected => {
        if (selected === true) return true;
        return this.router.createUrlTree(['/AppointmentsTimetable']);
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/AppointmentsTimetable']));
      })
    );
  }
}

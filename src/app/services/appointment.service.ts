import { Injectable } from '@angular/core';
import { Appointment } from '../models/Appointment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError,Observable,throwError} from 'rxjs';
import { Business } from '../models/Business';
import { AuthService } from './auth.service';
import { Timeslot } from '../models/Timeslot';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(public http:HttpClient, private auth:AuthService) { }
  domain = "https://nail-appointment-backend-production.up.railway.app";
  //domain = "http://localhost:8080";
  CurrentBusinessOwner: Business = new Business(0, '', '', '', '', '', '');
  CurrentStoredTimeslot:Timeslot = new Timeslot('','','',null,0);
  public RecieveData(data:Business){
    this.CurrentBusinessOwner = new Business(0, data.BusinessName, data.OwnerFirstName, data.OwnerLastName, data.OwnerEmail, data.OwnerPhone, data.OwnerPassword);
  }
  public GetCurrentSlot():Timeslot{
    return this.CurrentStoredTimeslot;
  }
  public RecieveAppointmentToBook(Slot:Timeslot){
    this.CurrentStoredTimeslot=Slot;
  }
  
  GetPendingAppointments():Observable<Appointment[]>{
    const headers = this.auth.createAuthenticationHeaders();
    return this.http.get<Appointment[]>(this.domain+'/api/appointments/getPending',{headers}).pipe(  
                catchError(this.handleError)
              )
  }
      private handleError(error: HttpErrorResponse) {
        if (error.status==400){
          console.error("invalid business data");
        }
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        return throwError(() => new Error(error.error));
      }
}

import { Injectable } from '@angular/core';
import { Appointment } from '../models/Appointment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError,Observable,Subject,throwError} from 'rxjs';
import { Business } from '../models/Business';
import { AuthService } from './auth.service';
import { Timeslot } from '../models/Timeslot';
import { AppointmentTypeData } from '../models/AppointmentTypeInfo';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(public http:HttpClient, private auth:AuthService) { }
  //domain = "https://nail-appointment-backend-production.up.railway.app";
  domain = "http://localhost:8080";
  CurrentStoredTimeslot:Timeslot = new Timeslot('','',0,'',null,0);
  public OnUpdateViewIndex: Subject<number> = new Subject<number>();
  public OnAppointmentSelected: Subject<boolean> = new Subject<boolean>();
  public OnBlankSlotSelected: Subject<boolean> = new Subject<boolean>();
  public AppointmentToReSchedule:Appointment = new Appointment(0,"","","","","","","",0,"",0,0,0);
  public SelectedBusinessForClientView='';
  public BusinessSelected = false;
  isRescheduling = false;
  AvailableAppointments:AppointmentTypeData[]=[new AppointmentTypeData("Gel",45,120),
    new AppointmentTypeData("Manicure" ,60,200),
    new AppointmentTypeData("Pedicure",55,300) ];
    public ValidSlotLength(slot:Timeslot,ApppointmentDuration:number){
      let start = this.GetNewDateFromTime(slot.StartTime);
      let end  = this.GetNewDateFromTime(slot.EndTime);
      let minutes = (end.getTime()-start.getTime())/60000;
      return minutes>=ApppointmentDuration;
    }
  public GetCurrentSlot():Timeslot{
    return this.CurrentStoredTimeslot;
  }
  public RecieveAppointment(Slot:Timeslot){
    this.CurrentStoredTimeslot=Slot;
  }
  public GetNewDateFromTime(Time: string): Date {
    let date = new Date();
    let [hours, minutes] = Time.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  UpdateAppointment(UpdatedAppointment:Appointment){
    const headers = this.auth.createAuthenticationHeaders();
    return this.http.post<string>(this.domain+'/api/appointments/update',UpdatedAppointment,{headers}).pipe(  
      catchError(this.handleError)
    )
  }
  CreateAppointment(NewAppointment:Appointment){
    const headers = this.auth.createAuthenticationHeaders();
    return this.http.post<Appointment>(this.domain+'/api/appointments/add',NewAppointment,{headers}).pipe(  
      catchError(this.handleError)
    )
  }
  GetAppointmentsForClients():Observable<Appointment[]>{
    const headers = this.auth.createAuthenticationHeaders();
    return this.http.get<Appointment[]>(this.domain+`/api/appointments/GetForClientView/${this.SelectedBusinessForClientView}`,{headers}).pipe(  
                catchError(this.handleError)
              )
  }
  GetAppointmentsForBusiness():Observable<Appointment[]>{
    const headers = this.auth.createAuthenticationHeaders();
    return this.http.get<Appointment[]>(this.domain+`/api/appointments/GetForBusinessView`,{headers}).pipe(  
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

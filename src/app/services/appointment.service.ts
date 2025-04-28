import { Injectable } from '@angular/core';
import { Appointment } from '../models/Appointment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError,Observable,Subject,throwError} from 'rxjs';
import { Business } from '../models/Business';
import { AuthService } from './auth.service';
import { Timeslot } from '../models/Timeslot';
import { AppointmentTypeData } from '../models/AppointmentTypeInfo';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(public http:HttpClient, private auth:AuthService,public dp:DatePipe) { }
  domain = "https://nail-appointment-backend-production.up.railway.app";
  //domain = "http://localhost:8080";
  CurrentStoredTimeslot:Timeslot = new Timeslot('','',0,'',null,0);
  public OnUpdateViewIndex: Subject<number> = new Subject<number>();
  public OnAppointmentSelected: Subject<boolean> = new Subject<boolean>();
  public OnBlankSlotSelected: Subject<boolean> = new Subject<boolean>();
  public AppointmentToReSchedule:Appointment = new Appointment(0,"","","","","","","",0,"",0,0,0);
  public SelectedBusinessForClientView='';
  public BusinessSelected = false;
  isRescheduling = false;
  AvailableAppointments:AppointmentTypeData[]=[new AppointmentTypeData("Gel",45,120),//temporary
    new AppointmentTypeData("Manicure" ,60,200),
    new AppointmentTypeData("Pedicure",55,300) ];
    public ValidSlotLength(slot:Timeslot,ApppointmentDuration:number){
      let start = this.GetNewDateFromTime(slot.StartTime);
      let end  = this.GetNewDateFromTime(slot.EndTime);
      let minutes = (end.getTime()-start.getTime())/60000;
      return minutes>=ApppointmentDuration;
    }
    public IsValidAppointment(SelectedSlot:Timeslot,OnNewError:Subject<string>,AppointmentInfo:Appointment,FormattedTimeString:string):boolean{
      var ValidAppointment = false;
      var LatestBookingTime = "21:00";
      var SlotLengthMinutes = Math.abs(this.GetNewDateFromTime(SelectedSlot.EndTime).getTime()
      -this.GetNewDateFromTime(SelectedSlot.StartTime).getTime())/60000;

      if(AppointmentInfo.AppointmentDurationInMinutes > SlotLengthMinutes){
      OnNewError.next("The selected appointment type is too long for this time slot");
      ValidAppointment=false;
      }
      else if(AppointmentInfo.AppointmentDurationInMinutes<SlotLengthMinutes){
      LatestBookingTime = this.dp.transform(this.GetNewDateFromTime(SelectedSlot.EndTime)
      .setMinutes(-AppointmentInfo.AppointmentDurationInMinutes),"HH:mm") as string;
      ValidAppointment=true;
      }        
      else if(AppointmentInfo.AppointmentDurationInMinutes == SlotLengthMinutes){
      LatestBookingTime = SelectedSlot.StartTime;
      ValidAppointment=true;
      }
  
      var timeFromInput = this.GetNewDateFromTime(FormattedTimeString);
      var BookingTimeOverflow = Math.trunc((this.GetNewDateFromTime(LatestBookingTime).getTime() - timeFromInput.getTime())/60000);
      if(this.GetNewDateFromTime(SelectedSlot.EndTime ).getTime() < timeFromInput.getTime()){
      OnNewError.next("The selected appointment time later than the selected time slot");return false;
      }
      if(timeFromInput.getTime() < this.GetNewDateFromTime(SelectedSlot.StartTime).getTime() ){
      OnNewError.next("The selected appointment time earlier than the selected time slot");return false;
      }
      if(BookingTimeOverflow<=0)
      { AppointmentInfo.AppointmentTime = FormattedTimeString; }
      else{
        ValidAppointment=false;
        OnNewError.next(`The selected appointment time must be ${BookingTimeOverflow} minutes earlier`);return false;
      }
      return ValidAppointment;
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
    return this.http.post<Appointment>(this.domain+'/api/appointments/add',NewAppointment).pipe(  
      catchError(this.handleError)
    )
  }
  GetAppointmentsForClients():Observable<Appointment[]>{
    return this.http.get<Appointment[]>(this.domain+`/api/appointments/GetForClientView/${this.SelectedBusinessForClientView}`).pipe(  
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
        console.error(error.message);
        return throwError(() => new Error(error.error));
      }
}

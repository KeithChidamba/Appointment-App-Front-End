import { Component } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Timeslot } from '../models/Timeslot';
import { DatePipe } from '@angular/common';
import { Appointment } from '../models/Appointment';
import { Validators, FormBuilder } from '@angular/forms';
import {NavigationStart, Router} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointment-info',
  templateUrl: './appointment-info.component.html',
  styleUrls: ['./appointment-info.component.css']
})
export class AppointmentInfoComponent {
constructor(private fb: FormBuilder,public apmnt:AppointmentService, public dp:DatePipe, private router:Router){}
TimeslotForEditing:Timeslot = new Timeslot('','',0,'',null,0);
AppointmentInfo:Appointment = new Appointment(0,"","","","","","","",0,"",0,0,0);
LatestBookingTime = "21:00";
ValidAppointment=false;
ValidatingTime=false;
private routerSubscription!: Subscription;
EarliestDate:string = this.dp.transform(new Date(),"yyyy-MM-dd") as string;
    Editingform = this.fb.group({
      AppointmentTime : ['',Validators.required]
    });
    ngOnInit(){
      this.ValidatingTime=this.apmnt.isRescheduling;
      this.apmnt.isRescheduling=false;
      this.TimeslotForEditing = this.apmnt.GetCurrentSlot();
      this.AppointmentInfo = this.TimeslotForEditing.CurrentAppointment as Appointment;
      this.routerSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          if(event.url !=="/AppointmentsTimetable" && event.url !=="/AppointmentInfo")
          {
            this.apmnt.isRescheduling = false;
            console.log('Route is changing, variable set to false');
          }
        }
      });
    }
    ReScheduleAppointment(){
        this.apmnt.isRescheduling=true;
        this.apmnt.AppointmentToReSchedule=this.AppointmentInfo;
        this.router.navigate(['/AppointmentsTimetable']);
    }
   ValidateAppointmentTime(){
     var SlotLengthMinutes = Math.abs(this.apmnt.GetNewDateFromTime(this.TimeslotForEditing.EndTime).getTime()
             -this.apmnt.GetNewDateFromTime(this.TimeslotForEditing.StartTime).getTime())/60000;
     if(this.AppointmentInfo.AppointmentDurationInMinutes > SlotLengthMinutes){
         //cant book appointment here
         console.log("invalid lendth for appointment: "+SlotLengthMinutes);
         this.ValidAppointment=false;
     }
     else if(this.AppointmentInfo.AppointmentDurationInMinutes<SlotLengthMinutes){
       this.LatestBookingTime = this.dp.transform(this.apmnt.GetNewDateFromTime(this.TimeslotForEditing.EndTime)
         .setMinutes(-this.AppointmentInfo.AppointmentDurationInMinutes),"HH:mm") as string;
         this.ValidAppointment=true;
     }        
     else if(this.AppointmentInfo.AppointmentDurationInMinutes == SlotLengthMinutes){
         this.LatestBookingTime = this.TimeslotForEditing.StartTime;
         this.ValidAppointment=true;
     }

     var FormattedTimeString  = this.dp.transform(this.apmnt.GetNewDateFromTime(this.Editingform.get('AppointmentTime')?.value as string),"HH:mm") as string;

     var timeFromInput = this.apmnt.GetNewDateFromTime(FormattedTimeString);
     if(this.apmnt.GetNewDateFromTime(this.LatestBookingTime).getTime() < timeFromInput.getTime() 
     || timeFromInput.getTime() < this.apmnt.GetNewDateFromTime(this.TimeslotForEditing.StartTime).getTime() )
     {console.log("invalid time for appointment: latest:"+this.LatestBookingTime);return}
     if(((this.apmnt.GetNewDateFromTime(this.LatestBookingTime).getTime() - timeFromInput.getTime())/60000) 
      >=  this.AppointmentInfo.AppointmentDurationInMinutes)
      { this.AppointmentInfo.AppointmentTime = FormattedTimeString; }
      else{this.ValidAppointment=false;}
     if(this.ValidAppointment){this.SaveChanges();}
  }
  SaveChanges(){
      if(this.ValidAppointment)
      {
        this.apmnt.UpdateAppointment(this.AppointmentInfo).subscribe((res)=>{
          console.log(res);
        });
        this.apmnt.isRescheduling = false;
        this.apmnt.OnAppointmentSelected.next(false);
      }
  }
  
}

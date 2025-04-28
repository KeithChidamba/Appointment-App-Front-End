import { Component } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Timeslot } from '../models/Timeslot';
import { DatePipe } from '@angular/common';
import { Appointment } from '../models/Appointment';
import { Validators, FormBuilder } from '@angular/forms';
import {NavigationStart, Router} from '@angular/router';
import { Subject, Subscription } from 'rxjs';

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
routerSubscription!: Subscription;
OnNewError:Subject<string> = new Subject<string>();
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
    var FormattedTimeString  = this.dp.transform(this.apmnt.GetNewDateFromTime(this.Editingform.get('AppointmentTime')?.value as string),"HH:mm") as string;
    this.ValidAppointment = this.apmnt.IsValidAppointment(this.TimeslotForEditing,this.OnNewError,this.AppointmentInfo,FormattedTimeString);
    if(this.ValidAppointment){this.SaveChanges();}
  }
  SaveChanges(){
      if(this.ValidAppointment)
      {
        this.apmnt.UpdateAppointment(this.AppointmentInfo).subscribe((res)=>{
          console.log(res);
        },
        (error)=>{
            this.OnNewError.next(error)
        });
        this.apmnt.isRescheduling = false;
        this.apmnt.OnAppointmentSelected.next(false);
      }
  }
  
}

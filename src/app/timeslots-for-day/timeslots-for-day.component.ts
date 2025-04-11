import { Component,Input,OnInit } from '@angular/core';
import { WeekDaySchedule } from '../models/WeekDaySchedule';
import { Timeslot } from '../models/Timeslot';
import { Router } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';
import { AppointmentsTimetableComponent } from '../appointments-timetable/appointments-timetable.component';

@Component({
  selector: 'app-timeslots-for-day',
  templateUrl: './timeslots-for-day.component.html',
  styleUrls: ['./timeslots-for-day.component.css']
})

export class TimeslotsForDayComponent {
  @Input()  WeekDays:WeekDaySchedule[]=[];
  constructor(private router:Router,private apmnt:AppointmentService,public auth:AuthService){}
  @Input() CurrentWeekIndex:number = 0;
  @Input() isDailyViewMode:boolean = true;
  Timeslots:Timeslot[]=[];
  ngOnInit(){
      this.Timeslots=this.WeekDays[this.CurrentWeekIndex].TimeSlots;
      AppointmentsTimetableComponent.OnUpdateViewIndex.subscribe((index)=>{
        if(this.isDailyViewMode){this.CurrentWeekIndex = index;}
        this.Timeslots=this.WeekDays[this.CurrentWeekIndex].TimeSlots;
      });
  }
  
   BookAppointment( BlankSlot:Timeslot){
    if(this.auth.loggedIn())return;
    console.log(BlankSlot);
    this.apmnt.RecieveAppointmentToBook(BlankSlot);
    this.router.navigate(['/AppointmentForm']);
 }
 EditAppointment(AppointmentSlot:Timeslot)
 {
  if(!this.auth.loggedIn())return;  
  console.log(AppointmentSlot);
  this.apmnt.RecieveAppointmentToBook(AppointmentSlot);
  this.router.navigate(['/AppointmentInfo']);
}
}

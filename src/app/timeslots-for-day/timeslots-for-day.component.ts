import { Component,Input } from '@angular/core';
import { WeekDaySchedule } from '../models/WeekDaySchedule';
import { Timeslot } from '../models/Timeslot';
import { Router } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-timeslots-for-day',
  templateUrl: './timeslots-for-day.component.html',
  styleUrls: ['./timeslots-for-day.component.css']
})

export class TimeslotsForDayComponent {
  @Input()  WeekDays:WeekDaySchedule[]=[];
  constructor(private router:Router,private apmnt:AppointmentService,public auth:AuthService){}
  CurrentWeekIndex:number = 0;
  Timeslots:Timeslot[]=this.WeekDays[this.CurrentWeekIndex].TimeSlots;
   BookAppointment( BlankSlot:Timeslot){
    if(this.auth.loggedIn())return;
    this.apmnt.RecieveAppointmentToBook(BlankSlot);
    this.router.navigate(['/AppointmentForm']);
}
 EditAppointment( AppointmentSlot:Timeslot){
  if(!this.auth.loggedIn())return;
    //OnTimeslotSelected?.Invoke(BlankSlot,false);
}
}

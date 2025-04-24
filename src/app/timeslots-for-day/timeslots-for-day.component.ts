import { Component,Input,OnInit } from '@angular/core';
import { WeekDaySchedule } from '../models/WeekDaySchedule';
import { Timeslot } from '../models/Timeslot';
import { Router } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Appointment } from '../models/Appointment';
@Component({
  selector: 'app-timeslots-for-day',
  templateUrl: './timeslots-for-day.component.html',
  styleUrls: ['./timeslots-for-day.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule 
  ],
})

export class TimeslotsForDayComponent {
  @Input()  WeekDays:WeekDaySchedule[]=[];
  constructor(private router:Router,private apmnt:AppointmentService,public auth:AuthService){}
  @Input() CurrentWeekIndex:number = 0;
  @Input() isDailyViewMode:boolean = true;
  Timeslots:Timeslot[]=[];
  AppointmentToReSchedule:Appointment = new Appointment(0,"","","","","","","",0,"",0,0,0);
  ngOnInit(){
      this.Timeslots=this.WeekDays[this.CurrentWeekIndex].TimeSlots;
      this.apmnt.OnUpdateViewIndex.subscribe((index)=>{
        if(this.isDailyViewMode){this.CurrentWeekIndex = index;}
        this.Timeslots=this.WeekDays[this.CurrentWeekIndex].TimeSlots;
      });
  }
  
   BookAppointment( BlankSlot:Timeslot){
    if(this.apmnt.isRescheduling){
      this.AppointmentToReSchedule = this.apmnt.AppointmentToReSchedule;
      if(this.apmnt.ValidSlotLength(BlankSlot,this.AppointmentToReSchedule.AppointmentDurationInMinutes))
        {
          this.AppointmentToReSchedule.AppointmentTime = BlankSlot.StartTime;
          this.AppointmentToReSchedule.AppointmentDate = BlankSlot.dateOfSlot;
          BlankSlot.CurrentAppointment = this.AppointmentToReSchedule;
          this.apmnt.RecieveAppointment(BlankSlot);
          this.apmnt.OnAppointmentSelected.next(true);
          this.router.navigate(['/AppointmentInfo']);
          return;
        }else{
          console.log("invalid timeslot for appointment")
          return;
        }
    }
    if(this.auth.loggedIn())return;
    this.apmnt.OnBlankSlotSelected.next(true);
    this.apmnt.RecieveAppointment(BlankSlot);
    this.router.navigate(['/AppointmentForm']);
 }
 EditAppointment(AppointmentSlot:Timeslot)
 {
  if(!this.auth.loggedIn())return;  
  if(this.apmnt.isRescheduling)return;
  this.apmnt.OnAppointmentSelected.next(true);
  this.apmnt.RecieveAppointment(AppointmentSlot);
  this.router.navigate(['/AppointmentInfo']);
}
}

import { Component,Input } from '@angular/core';
import { WeekDaySchedule } from '../models/WeekDaySchedule';
import { Timeslot } from '../models/Timeslot';

@Component({
  selector: 'app-timeslots-for-day',
  templateUrl: './timeslots-for-day.component.html',
  styleUrls: ['./timeslots-for-day.component.css']
})

export class TimeslotsForDayComponent {
  @Input()  WeekDays:WeekDaySchedule[]=[];
  CurrentWeekIndex:number = 0;
  Timeslots:Timeslot[]=this.WeekDays[this.CurrentWeekIndex].TimeSlots;
   BookAppointment( BlankSlot:Timeslot){
    //OnTimeslotSelected?.Invoke(BlankSlot,true);
}
 EditAppointment( BlankSlot:Timeslot){
    //OnTimeslotSelected?.Invoke(BlankSlot,false);
}
}

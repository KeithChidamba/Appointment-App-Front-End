import { Component,OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/Appointment';
import { WeekDaySchedule } from '../models/WeekDaySchedule';
import { NavigationIndex } from '../models/NavigationIndex';
import { DatePipe } from '@angular/common';
import { Timeslot } from '../models/Timeslot';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-appointments-timetable',
  templateUrl: './appointments-timetable.component.html',
  styleUrls: ['./appointments-timetable.component.css']
})
export class AppointmentsTimetableComponent {
constructor(private apmt: AppointmentService, public dp:DatePipe, private auth:AuthService){}
NumberOfDaysToShow:number = 7;
ScheduledAppointments: Appointment[]=[];
WeekDays:WeekDaySchedule[]=[new WeekDaySchedule(true),new WeekDaySchedule(true),new WeekDaySchedule(true),
  new WeekDaySchedule(true),new WeekDaySchedule(true),new WeekDaySchedule(true),new WeekDaySchedule(true)];
TimeslotNumbers = Array.from({ length: 13 }, (_, i) => i + 1);
WeekDaysToShow = this.WeekDays.slice(0, this.NumberOfDaysToShow);
ViewerIsBusinessOwner:boolean = false;
NavigationHistory:NavigationIndex[] = [];
CurrentWeekNavigationIndex:number=0;
CurrentAppointmentIndex:number=0;
AppointmentsLoaded:boolean = false;
DayViewIndex:number = 0;
NumFutureWeeksAhead:number = 0;
MaxFutureWeeksToShow:number = 3;
ShowDaliyOnly:boolean = false;
NavigateForwardtext:string='';
NavigateBacktext:string='';
CurrentWeekDates:Date[] = [];
StartOfWorkday:Date = this.apmt.GetNewDateFromTime('07:00');
public TimeslotWidthStyle:string='';
HeaderWidthStyle:string='';
HeadingWidthStyle:string='';
TimeslotSeperatorStyle:string='';
TimeSlotsMargin:string='';

ngOnInit() {
  if(this.auth.loggedIn()){
    this.apmt.GetAppointmentsForBusiness().subscribe(
      (data)=>{
        
        this.ScheduledAppointments = data; console.log(this.ScheduledAppointments); this.LoadWeeklyTable(new Date(),true);
    });
  }else{
    this.apmt.GetAppointmentsForClients().subscribe(
      (data)=>{

        this.ScheduledAppointments = data; console.log(this.ScheduledAppointments); this.LoadWeeklyTable(new Date(),true);
    });
  }

}
 
  SwitchView() {
    this.UpdateView(!this.ShowDaliyOnly);
  }
UpdateViewIndex(){
  this.apmt.OnUpdateViewIndex.next(this.DayViewIndex);
}
  UpdateView(ChangeView: boolean) {
    this.ShowDaliyOnly = ChangeView;
    this.NumberOfDaysToShow = this.ShowDaliyOnly ? 1 : 7;
    this.WeekDaysToShow = this.NumberOfDaysToShow === 1 ? this.WeekDays.slice(0, this.NumberOfDaysToShow):this.WeekDays;
    const widthOfHeaders = "150"//this.NumberOfDaysToShow === 1 ? '300' : '1000';
    this.TimeslotSeperatorStyle = this.NumberOfDaysToShow === 1 ? 'width:150px;' : 'width:305px;';
    this.HeadingWidthStyle = this.NumberOfDaysToShow === 1 ? 'width:300px;' : 'width:100%;';
    this.HeaderWidthStyle = `width:${widthOfHeaders}px;`;
    this.TimeslotWidthStyle = this.NumberOfDaysToShow === 1 ? 'width:305px;' : 'width:1225px;';
    this.NavigateBacktext = this.ShowDaliyOnly ? 'Previous Day' : 'Previous Week';
    this.NavigateForwardtext = this.ShowDaliyOnly ? 'Next Day' : 'Next Week';
    this.UpdateViewIndex();
  }

  async NavigateTable(GoForward: boolean) {
    if (GoForward) {
      if (this.ShowDaliyOnly) {
        if (this.DayViewIndex === 6) {
          if (this.NumFutureWeeksAhead < this.MaxFutureWeeksToShow)
            await this.LoadNextWeek(true);
        } else {this.DayViewIndex++;this.UpdateViewIndex();}
      } else if (this.NumFutureWeeksAhead < this.MaxFutureWeeksToShow)
        await this.LoadNextWeek(false);
    }
    if (!GoForward) {
      if (this.ShowDaliyOnly) {
        if (this.DayViewIndex > 0) {this.DayViewIndex--;this.UpdateViewIndex();}
        else if (
          this.DayViewIndex === 0 &&
          this.CurrentWeekDates[0].toLocaleDateString() !== new Date().toLocaleDateString()
        )
          await this.LoadPrevWeek(true);
      } else if (this.NumFutureWeeksAhead > 0) await this.LoadPrevWeek(false);
    }
  }

  async LoadNextWeek(SwitchToDaily: boolean) {
    this.NumFutureWeeksAhead++;
    this.CurrentAppointmentIndex = this.NavigationHistory[this.CurrentWeekNavigationIndex].weekEndIndex;
    this.CurrentWeekNavigationIndex++;
    const LastDayOfCurrentWeek = this.CurrentWeekDates[this.CurrentWeekDates.length - 1];
    await this.LoadWeeklyTable(new Date(LastDayOfCurrentWeek.setDate(LastDayOfCurrentWeek.getDate() + 1)), true);
    if (this.ShowDaliyOnly) this.DayViewIndex = 0;
    this.UpdateView(SwitchToDaily);
  }

  async LoadPrevWeek(SwitchToDaily: boolean) {
    this.NumFutureWeeksAhead--;
    this.CurrentWeekNavigationIndex--;
    this.CurrentAppointmentIndex = this.NavigationHistory[this.CurrentWeekNavigationIndex].weekStartIndex;
    this.NavigationHistory.splice(this.CurrentWeekNavigationIndex + 1,1);
    const FirstDayOfCurrentWeek = this.CurrentWeekDates[0];
    await this.LoadWeeklyTable(new Date(FirstDayOfCurrentWeek.setDate(FirstDayOfCurrentWeek.getDate() - 7)), false);
    if (this.ShowDaliyOnly) this.DayViewIndex = 6;
    this.UpdateView(SwitchToDaily);
  }
  
  async SetTimeTable(isNextWeek: boolean) {
    let numBlankDays = 0;
    let appointmentIndex = this.CurrentAppointmentIndex;
    const firstDate = new Date(this.ScheduledAppointments[0].AppointmentDate);
    for (let i = 0; i < this.CurrentWeekDates.length; i++) {
      if (firstDate.getTime() > this.CurrentWeekDates[i].getTime()) {
        await this.AddBlankTimeSlot(780, '08:00', '21:00', i);
        numBlankDays++;
      } else break;
    }
    for (let i = numBlankDays; i < this.CurrentWeekDates.length; i++) {
      const dateKey = this.CurrentWeekDates[i].toLocaleDateString();
      let earliestSlot = this.apmt.GetNewDateFromTime('08:00');
      let hasAppointments = false;
  
      while (
        appointmentIndex < this.ScheduledAppointments.length &&
        this.ScheduledAppointments[appointmentIndex].AppointmentDate === dateKey
      ) {
        hasAppointments = true;
        const appointment = this.ScheduledAppointments[appointmentIndex];
        const startTime = this.apmt.GetNewDateFromTime(appointment.AppointmentTime);
        let durationMinutes = appointment.AppointmentDurationInMinutes;
        if (startTime.getTime() > earliestSlot.getTime()) {
          const gapInMinutes = (startTime.getTime() - earliestSlot.getTime()) / 60000;
          await this.AddBlankTimeSlot(gapInMinutes, this.dp.transform(earliestSlot, 'HH:mm') as string, appointment.AppointmentTime, i);
        }
        const endTime = new Date(startTime.getTime());
        endTime.setMinutes(startTime.getMinutes() + durationMinutes);
        this.WeekDays[i].TimeSlots.push(
          new Timeslot(
            appointment.AppointmentTime,
            endTime.toLocaleTimeString(),
            i,this.dp.transform(this.CurrentWeekDates[i],'M/d/yyyy') as string,
            appointment,
            durationMinutes / 60
          )
        );
        earliestSlot = endTime;
        appointmentIndex++;
      }
      if (!hasAppointments || this.apmt.GetNewDateFromTime('21:00').getTime() - earliestSlot.getTime() > 0) {
        await this.AddBlankTimeSlot(
          (this.apmt.GetNewDateFromTime('21:00').getTime() - earliestSlot.getTime()) / 60000,
          earliestSlot.toLocaleTimeString(),
          '21:00',
          i
        );
      }
    }
    if (isNextWeek) {
      const newWeek = new NavigationIndex(this.CurrentAppointmentIndex, appointmentIndex);
      this.NavigationHistory.push(newWeek);
    }
  }
  
  async AddBlankTimeSlot(SizeOfSlotinMinutes: number, StartTime: string, EndTime: string, WeekdayIndex: number) {
    const newSlot = new Timeslot(
      StartTime,
      EndTime,
      WeekdayIndex,this.dp.transform(this.CurrentWeekDates[WeekdayIndex],'M/d/yyyy') as string,
      null,
      SizeOfSlotinMinutes / 60
    );
    this.WeekDays[WeekdayIndex].TimeSlots.push(newSlot);
  }
  
  async LoadWeeklyTable(FirstDayOfNewWeek: Date, LoadNextWeek: boolean) {
    this.CurrentWeekDates = [];
    this.WeekDays.forEach((t) => {
      t.TimeSlots = [];
      t.isEmpty = true;
    });
    for (let i = 0; i < 7; i++) {
      const date = new Date(FirstDayOfNewWeek); 
      date.setDate(date.getDate() + i);
      this.CurrentWeekDates.push(date);
    }    
    this.UpdateView(true);
    await this.SetTimeTable(LoadNextWeek);

    this.AppointmentsLoaded = true;
  }
}

import { Component,OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/Appointment';
import { WeekDaySchedule } from '../models/WeekDaySchedule';
import { NavigationIndex } from '../models/NavigationIndex';
import { DatePipe } from '@angular/common';
import { Timeslot } from '../models/Timeslot';

@Component({
  selector: 'app-appointments-timetable',
  templateUrl: './appointments-timetable.component.html',
  styleUrls: ['./appointments-timetable.component.css']
})
export class AppointmentsTimetableComponent {
constructor(private appointment: AppointmentService, public dp:DatePipe){}
NumberOfDaysToShow:number = 7;
ScheduledAppointments: Appointment[]=[];
WeekDays:WeekDaySchedule[]=[new WeekDaySchedule(true),new WeekDaySchedule(true),new WeekDaySchedule(true),
  new WeekDaySchedule(true),new WeekDaySchedule(true),new WeekDaySchedule(true),new WeekDaySchedule(true)];
TimeslotNumbers = Array.from({ length: 14 }, (_, i) => i + 1);
WeekDaysToShow = this.WeekDays.slice(0, this.NumberOfDaysToShow);
ViewerIsBusinessOwner:boolean = false;
NavigationHistory:NavigationIndex[] = [];
CurrentWeekNavigationIndex:number=0;
CurrentAppointmentIndex:number=0;
AppointmentsLoaded:boolean = false;
isBookingAppointment:boolean = false;
EditingAppointment:boolean = false;
DayViewIndex:number = 0;
NumFutureWeeksAhead:number = 0;
MaxFutureWeeksToShow:number = 3;
ShowDaliyOnly:boolean = false;
NavigateForwardtext:string='';
NavigateBacktext:string='';
CurrentWeekDates:Date[] = [];
StartOfWorkday:Date = new Date("08:00");
TimeslotWidthStyle:string='';
HeaderWidthStyle:string='';
HeadingWidthStyle:string='';
TimeslotSeperatorStyle:string='';
TimeSlotsMargin:string='';
ngOnInit() {
  this.appointment.GetPendingAppointments().subscribe(
    (data)=>{
      this.ScheduledAppointments = data;
      console.log(this.ScheduledAppointments);
  });
  //render client only view
  this.CurrentAppointmentIndex = 0;
  this.CurrentWeekNavigationIndex = 0;
  this.NumFutureWeeksAhead = 0;
}
 
  BookAppointment(Blankslot: Timeslot, isBlank: boolean) {
    if (this.ViewerIsBusinessOwner) return;
    if (isBlank) {
      this.isBookingAppointment = true;
      this.EditingAppointment = false;
     // OnBlankSlotSelected?.Invoke(Blankslot);
    } else {
      this.EditingAppointment = true;
      this.isBookingAppointment = false;
      //OnAppoinmentSlotSelected?.Invoke(Blankslot);
    }
  }

  SwitchView() {
    this.UpdateView(!this.ShowDaliyOnly);
  }

  UpdateView(ChangeView: boolean) {
    this.ShowDaliyOnly = ChangeView;
    this.NumberOfDaysToShow = this.ShowDaliyOnly ? 1 : 7;
    const WidthOfTable = this.NumberOfDaysToShow === 1 ? 30 : 80;
    const widthOfHeaders = this.NumberOfDaysToShow === 1 ? '15' : '10';
    this.TimeslotSeperatorStyle = this.NumberOfDaysToShow === 1 ? 'width:15vw;' : 'width:10vw;';
    this.HeadingWidthStyle = this.NumberOfDaysToShow === 1 ? 'width:30vw;' : 'width:80vw;';
    this.HeaderWidthStyle = `width:${widthOfHeaders}vw;`;
    this.TimeslotWidthStyle = `width:${WidthOfTable}vw;`;
    this.NavigateBacktext = this.ShowDaliyOnly ? 'Previous Day' : 'Previous Week';
    this.NavigateForwardtext = this.ShowDaliyOnly ? 'Next Day' : 'Next Week';
  }

  async NavigateTable(GoForward: boolean) {
    if (GoForward) {
      if (this.ShowDaliyOnly) {
        if (this.DayViewIndex === 6) {
          if (this.NumFutureWeeksAhead < this.MaxFutureWeeksToShow)
            await this.LoadNextWeek(true);
        } else this.DayViewIndex++;
      } else if (this.NumFutureWeeksAhead < this.MaxFutureWeeksToShow)
        await this.LoadNextWeek(false);
    }
    if (!GoForward) {
      if (this.ShowDaliyOnly) {
        if (this.DayViewIndex > 0) this.DayViewIndex--;
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
    this.NavigationHistory.splice(this.CurrentWeekNavigationIndex + 1);
    const FirstDayOfCurrentWeek = this.CurrentWeekDates[0];
    await this.LoadWeeklyTable(new Date(FirstDayOfCurrentWeek.setDate(FirstDayOfCurrentWeek.getDate() - 7)), false);
    if (this.ShowDaliyOnly) this.DayViewIndex = 6;
    this.UpdateView(SwitchToDaily);
  }

  async SetTimeTable(isNextWeek: boolean) {
    let numBlankDays = 0;
    let appointmentIndex = this.CurrentAppointmentIndex;
    const firstDate = this.ScheduledAppointments[0].AppointmentDate;
    for (let i = 0; i < this.CurrentWeekDates.length; i++) {
      if (new Date(firstDate) > this.CurrentWeekDates[i]) {
        await this.AddBlankTimeSlot(840, '08:00', '21:00', i);
        numBlankDays++;
      } else break;
    }
    for (let i = numBlankDays; i < this.CurrentWeekDates.length; i++) {
      const dateKey = this.CurrentWeekDates[i].toLocaleDateString();
      let earliestSlot = new Date('08:00');
      let hasAppointments = false;
      while (
        appointmentIndex < this.ScheduledAppointments.length &&
        this.ScheduledAppointments[appointmentIndex].AppointmentDate === dateKey
      ) {
        hasAppointments = true;
        const appointment = this.ScheduledAppointments[appointmentIndex];
        const startTime = new Date(appointment.AppointmentTime);
        const endTime = new Date(startTime.getTime() + appointment.AppointmentDurationInMinutes * 60000);
        if (endTime.getTime() - earliestSlot.getTime() > 0) {
          await this.AddBlankTimeSlot(
            (startTime.getTime() - earliestSlot.getTime()) / 60000,
            this.dp.transform(earliestSlot,'HH:mm') as string,
            appointment.AppointmentTime,
            i
          );
        }
        this.WeekDays[i].TimeSlots.push(
          new Timeslot( appointment.AppointmentTime, endTime.toLocaleTimeString(),appointment.AppointmentDate,appointment,appointment.AppointmentDurationInMinutes / 60)
        );
        this.WeekDays[i].isEmpty = false;
        earliestSlot = endTime;
        appointmentIndex++;
      }
      if (!hasAppointments || new Date('22:00').getTime() - earliestSlot.getTime() > 0) {
        await this.AddBlankTimeSlot((new Date('22:00').getTime() - earliestSlot.getTime()) / 60000, earliestSlot.toLocaleTimeString(), '22:00', i);
      }
    }
    if (isNextWeek) {
      const newWeek = new NavigationIndex(this.CurrentAppointmentIndex, appointmentIndex);
      this.NavigationHistory.push(newWeek);
    }
  }

  async AddBlankTimeSlot(SizeOfSlotMultiplier: number, StartTime: string, EndTime: string, WeekdayIndex: number) {
    const newSlot = new Timeslot( StartTime, EndTime, this.CurrentWeekDates[WeekdayIndex].toLocaleDateString(),null,SizeOfSlotMultiplier / 60);
    this.WeekDays[WeekdayIndex].TimeSlots.push(newSlot);
    await new Promise(resolve => setTimeout(resolve, 1));
  }
  async LoadWeeklyTable(FirstDayOfNewWeek: Date, LoadNextWeek: boolean) {
    this.CurrentWeekDates = [];
    this.WeekDays.forEach((t) => {
      t.TimeSlots = [];
      t.isEmpty = true;
    });
    
    for (let i = 0; i < 7; i++) {
      this.CurrentWeekDates.push(new Date(FirstDayOfNewWeek.setDate(FirstDayOfNewWeek.getDate() + i)));
    }
    this.UpdateView(true);

    this.AppointmentsLoaded = true;
    await this.SetTimeTable(LoadNextWeek);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsTimetableRoutingModule } from './appointments-timetable-routing.module';
import { AppointmentsTimetableComponent } from './appointments-timetable.component';
import { TimeslotsForDayComponent } from '../timeslots-for-day/timeslots-for-day.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppointmentsTimetableComponent
  ],
  imports: [
    CommonModule,
    AppointmentsTimetableRoutingModule,RouterModule
    ,TimeslotsForDayComponent  
  ]
})
export class AppointmentsTimetableModule { }

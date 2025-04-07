import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsTimetableRoutingModule } from './appointments-timetable-routing.module';
import { AppointmentsTimetableComponent } from './appointments-timetable.component';


@NgModule({
  declarations: [
    AppointmentsTimetableComponent
  ],
  imports: [
    CommonModule,
    AppointmentsTimetableRoutingModule
  ]
})
export class AppointmentsTimetableModule { }

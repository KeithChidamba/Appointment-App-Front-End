import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentFormRoutingModule } from './appointment-form-routing.module';
import { AppointmentFormComponent } from './appointment-form.component';


@NgModule({
  declarations: [
    AppointmentFormComponent
  ],
  imports: [
    CommonModule,
    AppointmentFormRoutingModule
  ]
})
export class AppointmentFormModule { }

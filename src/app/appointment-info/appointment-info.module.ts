import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentInfoRoutingModule } from './appointment-info-routing.module';
import { AppointmentInfoComponent } from './appointment-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorDisplayComponent } from '../error-display/error-display.component';


@NgModule({
  declarations: [
    AppointmentInfoComponent
  ],
  imports: [
    CommonModule,
    AppointmentInfoRoutingModule,ReactiveFormsModule,ErrorDisplayComponent
  ]
})
export class AppointmentInfoModule { }

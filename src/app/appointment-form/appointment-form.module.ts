import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentFormRoutingModule } from './appointment-form-routing.module';
import { AppointmentFormComponent } from './appointment-form.component';
import { ErrorDisplayComponent } from '../error-display/error-display.component';


@NgModule({
  declarations: [
    AppointmentFormComponent
  ],
  imports: [
    CommonModule,
    AppointmentFormRoutingModule,ReactiveFormsModule,ErrorDisplayComponent
  ]
})
export class AppointmentFormModule { }

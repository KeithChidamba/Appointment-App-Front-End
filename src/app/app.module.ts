import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AppointmentService } from './services/appointment.service';
import { TimeslotsForDayComponent } from './timeslots-for-day/timeslots-for-day.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeslotsForDayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule
  ],
  providers: [AuthService,AppointmentService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

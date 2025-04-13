import { Component,OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Timeslot } from '../models/Timeslot';
import { Appointment } from '../models/Appointment';
import { DatePipe } from '@angular/common';
import { FormBuilder,Validators } from '@angular/forms';
import { AvailableAppointments } from '../interfaces/AvailableAppointments';
import { AppointmentTypeData } from '../models/AppointmentTypeInfo';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  constructor(private fb: FormBuilder,private apmnt:AppointmentService, public dp:DatePipe){}
  BlankSlotForBooking:Timeslot = new Timeslot('','','',null,0);
  AppointmentInfo:Appointment = new Appointment(0,"","","","","","","",0,"",0,0,0);
  ValidAppointment:boolean=false;
  LatestBookingTime:string = "21:00";
  checkingValidity = false;
  EarliestDate:string = this.dp.transform(new Date(),"yyyy-MM-dd") as string;
  Bookingform = this.fb.group({
      ClientEmail : ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(30),
        Validators.required,
        Validators.email
      ])],
      ClientPhone : ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{10}$') 
      ])],
      ClientFirstName : ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ])],
      ClientLastName : ['', Validators.compose([
        Validators.minLength(4),
        Validators.maxLength(30),
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/)
      ])],      
      AppointmentTime : [''],
      AppointmentDate : ['']
    });
    ngOnInit(){
      this.BlankSlotForBooking = this.apmnt.GetCurrentSlot();
      console.log(this.BlankSlotForBooking);
  }

   SetAppointmentType(event:Event){
    this.checkingValidity = true;
     this.AppointmentInfo.AppointmentName = (event.target as HTMLInputElement).value;
     this.AppointmentInfo.AppointmentDate = this.dp.transform(this.Bookingform.get('AppointmentDate')?.value as string,"yyyy-MM-dd") as string;
     this.AppointmentInfo.AppointmentTime = this.dp.transform(this.Bookingform.get('AppointmentTime')?.value as string,"HH:mm") as string;
      var selectedAppointment:AppointmentTypeData = AvailableAppointments.List[AvailableAppointments.List.findIndex(a =>a.AppointmentName 
       === this.AppointmentInfo.AppointmentName)];
     this.AppointmentInfo.AppointmentPrice = selectedAppointment.AppointmentPrice;
     this.AppointmentInfo.AppointmentDurationInMinutes = selectedAppointment.AppointmentDurationInMinutes;
     var SlotLengthMinutes = this.apmnt.GetNewDateFromTime(this.BlankSlotForBooking.EndTime).getTime()
             -this.apmnt.GetNewDateFromTime(this.BlankSlotForBooking.StartTime).getTime();
     if(this.AppointmentInfo.AppointmentDurationInMinutes > SlotLengthMinutes){
         //cant book appointment here
         console.log("invalid lendth for appointment: "+SlotLengthMinutes);
         this.ValidAppointment=false;
     }
     else if(this.AppointmentInfo.AppointmentDurationInMinutes<SlotLengthMinutes){
       this.LatestBookingTime = this.dp.transform(this.apmnt.GetNewDateFromTime(this.BlankSlotForBooking.EndTime)
         .setMinutes(-this.AppointmentInfo.AppointmentDurationInMinutes),"HH:mm") as string;
         this.ValidAppointment=true;
     }        
     else if(this.AppointmentInfo.AppointmentDurationInMinutes == SlotLengthMinutes){
         this.LatestBookingTime = this.BlankSlotForBooking.StartTime;
         this.ValidAppointment=true;
     }
  }
  SaveChanges(){
    if(this.Bookingform.valid && this.ValidAppointment ){
      this.AppointmentInfo.isConfirmed = 0;
      this.AppointmentInfo.ClientFirstName = this.Bookingform.get('ClientFirstName')?.value as string;
      this.AppointmentInfo.ClientLastName = this.Bookingform.get('ClientLastName')?.value as string;
      this.AppointmentInfo.ClientEmail = this.Bookingform.get('ClientEmail')?.value as string;
      this.AppointmentInfo.ClientPhone = this.Bookingform.get('ClientPhone')?.value as string;
      this.apmnt.UpdateAppointment(this.AppointmentInfo);
      }
  }
}

import { Component,OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Timeslot } from '../models/Timeslot';
import { Appointment } from '../models/Appointment';
import { DatePipe } from '@angular/common';
import { FormBuilder,Validators } from '@angular/forms';
import { AppointmentTypeData } from '../models/AppointmentTypeInfo';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  constructor(private fb: FormBuilder,public apmnt:AppointmentService, public dp:DatePipe){}
  BlankSlotForBooking:Timeslot = new Timeslot('','',0,'',null,0);
  AppointmentInfo:Appointment = new Appointment(0,"","","","","","","",0,"",0,0,0);
  ValidAppointment:boolean=false;
  LatestBookingTime:string = "21:00";
  checkingValidity = false;
  OnNewError:Subject<string> = new Subject<string>();
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
      AppointmentTime : ['']
    });
    ngOnInit(){
      this.BlankSlotForBooking = this.apmnt.GetCurrentSlot();
  }

   SetAppointmentType(event:Event){
    this.checkingValidity = true;
     this.AppointmentInfo.AppointmentName = (event.target as HTMLInputElement).value;
     this.AppointmentInfo.AppointmentDate = this.BlankSlotForBooking.dateOfSlot;
      var selectedAppointment:AppointmentTypeData = this.apmnt.AvailableAppointments[this.apmnt.AvailableAppointments.findIndex(a =>a.AppointmentName 
       === this.AppointmentInfo.AppointmentName)];
     this.AppointmentInfo.AppointmentPrice = selectedAppointment.AppointmentPrice;
     this.AppointmentInfo.AppointmentDurationInMinutes = selectedAppointment.AppointmentDurationInMinutes;

  }
  SaveChanges(){
    var SlotLengthMinutes = Math.abs(this.apmnt.GetNewDateFromTime(this.BlankSlotForBooking.EndTime).getTime()
    -this.apmnt.GetNewDateFromTime(this.BlankSlotForBooking.StartTime).getTime())/60000;
    if(this.AppointmentInfo.AppointmentDurationInMinutes > SlotLengthMinutes){
    //cant book appointment here
    this.OnNewError.next("The selected appointment type is too long for this time slot");
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

    var FormattedTimeString  = this.dp.transform(this.apmnt.GetNewDateFromTime(this.Bookingform.get('AppointmentTime')?.value as string),"HH:mm") as string;

    var timeFromInput = this.apmnt.GetNewDateFromTime(FormattedTimeString);
    if(this.apmnt.GetNewDateFromTime(this.LatestBookingTime).getTime() < timeFromInput.getTime()){
    this.OnNewError.next("The selected appointment time later than the selected time slot");return;
    }
    if(timeFromInput.getTime() < this.apmnt.GetNewDateFromTime(this.BlankSlotForBooking.StartTime).getTime() ){
    this.OnNewError.next("The selected appointment time earlier than the selected time slot");return;
    }
    if(((this.apmnt.GetNewDateFromTime(this.LatestBookingTime).getTime() - timeFromInput.getTime())/60000) 
    >=  this.AppointmentInfo.AppointmentDurationInMinutes)
    { this.AppointmentInfo.AppointmentTime = FormattedTimeString; }
    else{this.ValidAppointment=false;
    let minutes = Math.abs((timeFromInput.getTime()-this.apmnt.GetNewDateFromTime(this.BlankSlotForBooking.EndTime).getTime())/60000);
    this.OnNewError.next(`The selected appointment time must be ${minutes} minutes earlier`);return;
    }
    if(this.Bookingform.valid && this.ValidAppointment ){
      this.AppointmentInfo.isConfirmed = 0;
      this.AppointmentInfo.ClientFirstName = this.Bookingform.get('ClientFirstName')?.value as string;
      this.AppointmentInfo.ClientLastName = this.Bookingform.get('ClientLastName')?.value as string;
      this.AppointmentInfo.ClientEmail = this.Bookingform.get('ClientEmail')?.value as string;
      this.AppointmentInfo.ClientPhone = this.Bookingform.get('ClientPhone')?.value as string;
        this.apmnt.CreateAppointment(this.AppointmentInfo).subscribe((res)=>{
          console.log(res);
        });this.apmnt.OnBlankSlotSelected.next(false);
        }
  }
}

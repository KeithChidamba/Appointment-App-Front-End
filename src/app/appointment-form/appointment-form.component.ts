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
      AppointmentTime : ['',Validators.compose([
        Validators.required])]
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
    if(!this.checkingValidity){this.OnNewError.next("The please select a valid appointment");return;}
    if(!this.Bookingform.valid){this.OnNewError.next("Please corrrect your details");return;}
    var FormattedTimeString  = this.dp.transform(this.apmnt.GetNewDateFromTime(this.Bookingform.get('AppointmentTime')?.value as string),"HH:mm") as string;
    this.ValidAppointment = this.apmnt.IsValidAppointment(this.BlankSlotForBooking,this.OnNewError,this.AppointmentInfo,FormattedTimeString);
    if(this.Bookingform.valid && this.ValidAppointment ){
      this.AppointmentInfo.isConfirmed = 0;
      this.AppointmentInfo.ClientFirstName = this.Bookingform.get('ClientFirstName')?.value as string;
      this.AppointmentInfo.ClientLastName = this.Bookingform.get('ClientLastName')?.value as string;
      this.AppointmentInfo.ClientEmail = this.Bookingform.get('ClientEmail')?.value as string;
      this.AppointmentInfo.ClientPhone = this.Bookingform.get('ClientPhone')?.value as string;
        this.apmnt.CreateAppointment(this.AppointmentInfo).subscribe((res)=>{
          console.log(res);
        },
        (error)=>{
            this.OnNewError.next(error)
        });
        this.apmnt.OnBlankSlotSelected.next(false);
    }
  }
}

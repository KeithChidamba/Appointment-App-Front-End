import { Component } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Timeslot } from '../models/Timeslot';
import { DatePipe } from '@angular/common';
import { Appointment } from '../models/Appointment';
import { AppointmentTypeData } from '../models/AppointmentTypeInfo';
import { AvailableAppointments } from '../interfaces/AvailableAppointments';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-appointment-info',
  templateUrl: './appointment-info.component.html',
  styleUrls: ['./appointment-info.component.css']
})
export class AppointmentInfoComponent {
constructor(private fb: FormBuilder,private apmnt:AppointmentService, public dp:DatePipe){}
AppointmentTypeList:AppointmentTypeData[]=AvailableAppointments.List.slice(0,3);
TimeslotForEditing:Timeslot = new Timeslot('','','',null,0);
AppointmentInfo:Appointment = new Appointment(0,"","","","","","","",0,"",0,0,0);
ValidAppointment:boolean=false;
LatestBookingTime:string = "21:00";
EarliestDate:string = this.dp.transform(new Date(),"yyyy-MM-dd") as string;
    Editingform = this.fb.group({
      AppointmentTime : [''],
      AppointmentDate : ['']
    });
ngOnInit(){
  this.TimeslotForEditing = this.apmnt.GetCurrentSlot();
  console.log(this.TimeslotForEditing);
}

   SetAppointmentType(event:Event){
     this.AppointmentInfo.AppointmentName = (event.target as HTMLInputElement).value;
     this.AppointmentInfo.AppointmentDate = this.dp.transform(this.Editingform.get('AppointmentDate')?.value as string,"yyyy-MM-dd") as string;
     this.AppointmentInfo.AppointmentTime = this.dp.transform(this.Editingform.get('AppointmentTime')?.value as string,"HH:mm") as string;
      var selectedAppointment:AppointmentTypeData = AvailableAppointments.List[AvailableAppointments.List.findIndex(a =>a.AppointmentName 
       === this.AppointmentInfo.AppointmentName)];
     this.AppointmentInfo.AppointmentPrice = selectedAppointment.AppointmentPrice;
     this.AppointmentInfo.AppointmentDurationInMinutes = selectedAppointment.AppointmentDurationInMinutes;
     var SlotLengthMinutes = this.apmnt.GetNewDateFromTime(this.TimeslotForEditing.EndTime).getTime()
             -this.apmnt.GetNewDateFromTime(this.TimeslotForEditing.StartTime).getTime();
     if(this.AppointmentInfo.AppointmentDurationInMinutes > SlotLengthMinutes){
         //cant book appointment here
         console.log("invalid lendth for appointment: "+SlotLengthMinutes);
         this.ValidAppointment=false;
     }
     else if(this.AppointmentInfo.AppointmentDurationInMinutes<SlotLengthMinutes){
       this.LatestBookingTime = this.dp.transform(this.apmnt.GetNewDateFromTime(this.TimeslotForEditing.EndTime)
         .setMinutes(-this.AppointmentInfo.AppointmentDurationInMinutes),"HH:mm") as string;
         this.ValidAppointment=true;
     }        
     else if(this.AppointmentInfo.AppointmentDurationInMinutes == SlotLengthMinutes){
         this.LatestBookingTime = this.TimeslotForEditing.StartTime;
         this.ValidAppointment=true;
     }
  }
  SaveChanges(){
      if(this.ValidAppointment)
      {
          this.apmnt.UpdateAppointment(this.AppointmentInfo);
      }
  }
}

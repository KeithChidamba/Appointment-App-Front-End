import { Component,OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Timeslot } from '../models/Timeslot';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  constructor(private apmnt:AppointmentService){}
  BlankSlotForBooking:Timeslot = new Timeslot('','','',null,0);
  ngOnInit(){
    this.BlankSlotForBooking = this.apmnt.GetCurrentSlot();
    console.log(this.BlankSlotForBooking);
}
}

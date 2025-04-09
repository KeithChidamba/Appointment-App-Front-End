import { Component } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Timeslot } from '../models/Timeslot';

@Component({
  selector: 'app-appointment-info',
  templateUrl: './appointment-info.component.html',
  styleUrls: ['./appointment-info.component.css']
})
export class AppointmentInfoComponent {
constructor(private apmnt:AppointmentService){}
TimeslotForEditing:Timeslot = new Timeslot('','','',null,0);
ngOnInit(){
  this.TimeslotForEditing = this.apmnt.GetCurrentSlot();
  console.log(this.TimeslotForEditing);
}
}

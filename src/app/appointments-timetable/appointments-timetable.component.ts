import { Component,OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/Appointment';

@Component({
  selector: 'app-appointments-timetable',
  templateUrl: './appointments-timetable.component.html',
  styleUrls: ['./appointments-timetable.component.css']
})
export class AppointmentsTimetableComponent {
constructor(private appointment: AppointmentService){}
Appointments: Appointment[]=[];

ngOnInit() {
  this.appointment.GetPendingAppointments().subscribe(
    (data)=>{
      this.Appointments = data;
      console.log(this.Appointments);
  });
}

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from 'node_modules/@angular/router';
import { AppointmentsTimetableComponent } from './appointments-timetable.component';

const routes: Routes = [{ path: '', component: AppointmentsTimetableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsTimetableRoutingModule { }

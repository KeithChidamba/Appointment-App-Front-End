import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentInfoComponent } from './appointment-info.component';

const routes: Routes = [{ path: '', component: AppointmentInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentInfoRoutingModule { }

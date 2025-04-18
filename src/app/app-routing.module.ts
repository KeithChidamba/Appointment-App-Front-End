import { NgModule } from '@angular/core';
import { RouterModule, Routes } from 'node_modules/@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AppointmentEditGuard } from './guards/appointment-edit.guard';
import { AppointmentBookingGuard } from './guards/appointment-booking.guard';
import { TimetableViewGuard} from './guards/timetable-view.guard';

const routes: Routes = [
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  { path: 'Profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),canActivate: [AuthGuard] },
  { path: 'AppointmentsTimetable', loadChildren: () => import('./appointments-timetable/appointments-timetable.module').then(m => m.AppointmentsTimetableModule), canActivate: [TimetableViewGuard]},
  { path: 'AppointmentForm', loadChildren: () => import('./appointment-form/appointment-form.module').then(m => m.AppointmentFormModule), canActivate: [AuthGuard,AppointmentBookingGuard]},
  { path: 'AppointmentInfo', loadChildren: () => import('./appointment-info/appointment-info.module').then(m => m.AppointmentInfoModule), canActivate: [AuthGuard,AppointmentEditGuard]},
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '', // send unknown routes to the default route
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

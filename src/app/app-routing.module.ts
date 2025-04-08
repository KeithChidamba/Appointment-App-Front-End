import { NgModule } from '@angular/core';
import { RouterModule, Routes } from 'node_modules/@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  { path: 'Profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),canActivate: [AuthGuard] },
  { path: 'AppointmentsTimetable', loadChildren: () => import('./appointments-timetable/appointments-timetable.module').then(m => m.AppointmentsTimetableModule),canActivate: [AuthGuard] },
  { path: '**', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),pathMatch:'full'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

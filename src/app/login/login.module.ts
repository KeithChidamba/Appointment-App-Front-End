import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ErrorDisplayComponent } from '../error-display/error-display.component';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,ReactiveFormsModule,FormsModule,HttpClientModule,ErrorDisplayComponent
  ]
})
export class LoginModule { }

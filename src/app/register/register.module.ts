import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from 'node_modules/@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';
import { HttpClientModule} from "@angular/common/http";
import { ErrorDisplayComponent } from '../error-display/error-display.component';


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,ReactiveFormsModule,FormsModule,HttpClientModule,ErrorDisplayComponent
  ]
})
export class RegisterModule { }

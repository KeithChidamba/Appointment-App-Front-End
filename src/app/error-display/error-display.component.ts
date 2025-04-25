import { Component,NgModule,Input,OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-display',
  templateUrl: './error-display.component.html',
  styleUrls: ['./error-display.component.css'],
  standalone: true,
    imports: [
      CommonModule
    ]
})
export class ErrorDisplayComponent {
  @Input()  OnNewError:Subject<string> = new Subject<string>();
  CurrentErrorMessage = '';
  DisplayingError = false;
  ngOnInit(){
    this.OnNewError.subscribe((message)=>{
      this.CurrentErrorMessage = message;
      this.DisplayingError = true;
      setTimeout(() => {
        this.DisplayingError = false;
      }, 8000);
    })
  }
}

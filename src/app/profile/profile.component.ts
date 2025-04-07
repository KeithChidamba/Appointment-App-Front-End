import { Component,OnInit,Injectable } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { TaskManagerService } from '../services/task-manager.service';
import { User } from '../interfaces/userInt';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ProfileComponent {
user:User={
  username:'',
  email:'',
  password:'',
}
loaded = false;
number_of_Tasks = 0;
constructor(public auth:AuthService,private task_m:TaskManagerService){}
ngOnInit(){
  if(!this.loaded){
    this.auth.getProfile().subscribe(
      (profile)=>{
        this.load_user_info(profile)
      }
    )
  }
}
load_user_info(info:any){
    this.user.username =JSON.stringify(info.name).slice(1, -1);
    this.user.email=JSON.stringify(info.email).slice(1, -1);
    this.loaded = true;
    this.task_m.GetTasks(this.user).subscribe(
      (tasks)=>{
        let t = JSON.parse(JSON.stringify(tasks));
        for(let i=0;i<t.tasks.length;i++){
          this.number_of_Tasks++;
        }
    })
}
}

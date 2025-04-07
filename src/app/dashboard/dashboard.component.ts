import { Component,OnInit } from '@angular/core';
import { TaskManagerService } from '../services/task-manager.service';
import {tasks } from '../interfaces/tasks';
import { task } from '../interfaces/task';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { task_operation } from '../interfaces/task_operation';
import { User } from '../interfaces/userInt';
import { DateManagerService } from '../services/date-manager.service';
import { week } from '../interfaces/Week';
import { Day_of_Week } from '../interfaces/Day';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(public dm:DateManagerService,public task_m:TaskManagerService,private auth:AuthService,private fb:FormBuilder){
    this.yesterday =dm.Get_yesterday();
    this.current_date=dm.Get_today();
    this.tomorrow =dm.Get_tomorrow();
  }

  task_operation_instance:task_operation={
    task_name:'',
    task_description:'',
    task_belongs_to:'',
    Task_due_date:''
  }
  Current_day_of_week:Day_of_Week={
    Day_name:'Monday',
    Day_number:1
  }
  task_instance:task={
    task_number:0,
    Task_due_Day:'',
    task_name:'',
    task_description:'',
    task_belongs_to:'',
    Task_due_date:''
  }
  retrieve_task:User={
    username:'',
    email:'',
    password:'',
  }
  Week = week;
  current_date ='';
  current_day_index = 0;
  yesterday = '';
  tomorrow = '';
  err = false;
  checkingValidity =false;
  errorAlert='';
  loaded_user =false;  
  tasks_ = tasks;
  Adding_task=false;
  viewing_task=0;
  username='';
  viewing_tasks=0;
  viewing_days=false;
  current_view_day ='';
  Task_Form = this.fb.group({
    task_name : ['', Validators.compose([
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.required
    ])],
    task_description : ['', Validators.compose([
      Validators.minLength(5),
      Validators.maxLength(80),
      Validators.required
    ])],
    Task_due_date : ['', Validators.compose([
      Validators.required,
    ])],
  });

  ngOnInit(){
    this.tasks_ = [];
    if(!this.loaded_user){
      this.auth.getProfile().subscribe(
        (profile)=>{
          this.load_user(profile);
        },
        (error)=>{
          this.handle_request_error(true, error);
        }
      );
    }
  }

  load_user(info:any){
    this.username =JSON.stringify(info.name).slice(1, -1);
    this.retrieve_task.username =this.username;
    this.loaded_user = true;
    this.Get_tasks();
  } 

  load_task(info:any){
    let t = JSON.parse(JSON.stringify(info));
    for (let i=0;i<t.tasks.length;i++){
      this.task_instance = {
        task_number:i+1,
        Task_due_Day:this.dm.Get_task_Due_Day(t.tasks[i]),
        task_name:t.tasks[i].task_name,
        task_description:t.tasks[i].task_description,
        Task_due_date:t.tasks[i].Task_due_date,
        task_belongs_to:t.tasks[i].task_belongs_to
      }
      //if task list property is eaqual to name of list 
      this.tasks_.push(this.task_instance);
    } 
  }

  //taskoperations
  Add_task(){
    this.checkingValidity =true;
    if(this.Task_Form.valid){
      this.task_operation_instance={
        task_name:this.Task_Form.get('task_name')?.value,
        task_description:this.Task_Form.get('task_description')?.value,
        Task_due_date:this.Task_Form.get('Task_due_date')?.value, 
        task_belongs_to:this.username
      }
      this.task_m.Add_Task(this.task_operation_instance).subscribe(
        (data)=>{
          this.Add_task_View(false);
        },
        (error)=>{
          console.log("got adding error: ",this.err)
          this.handle_request_error(true, error);
        }
      );
    }
  }
  remove_task(task_name:string){
    this.task_operation_instance.task_name =task_name;
    this.task_m.Delete_task(this.task_operation_instance).subscribe();
    this.Reload_tasks(300);
  }
  Get_tasks(){
    if(this.loaded_user){
      this.task_m.GetTasks(this.retrieve_task).subscribe(
        (tasks)=>{
          this.load_task(tasks);
        },
        (error)=>{
          this.handle_request_error(true, error);
        }
      );
    }
  }

//ui logic
  Show_tasks(day:number){
      this.viewing_tasks = day;
      switch(day){
        case 1:
          this.current_view_day ='Yesterday';
          break;
        case 2:
          this.current_view_day ='Today';
          break;
        case 3:
          this.current_view_day ='Tomorrow';
          break;
        case 4:
          this.current_view_day ='Tasks';
          break;
      }
      this.viewing_days =false;
  }
  Show_task_description(task_num:number,operation:number){
    //hide task details
    if(operation==0){
      this.viewing_task = 0;
    }
    //view task
    if(operation==1){
      this.viewing_task = task_num;
    }
  }
  Add_task_View(set:boolean){
    this.viewing_task = 0
    this.Adding_task=set;
    if(!set){
      this.Reload_tasks(150);
    }
  }
  ChangeWeekDay(operation: string){
    this.viewing_days =true;
    //cant go less than monday
    if(operation=='back'&&this.current_day_index>0){
      this.current_day_index-=1;
      this.Current_day_of_week = week[this.current_day_index];
      this.Show_task_description(0,0);
    }
    //cant go more than sunday
    if(operation=='forward'&&this.current_day_index<6){
      this.current_day_index+=1;
      this.Current_day_of_week = week[this.current_day_index];
      this.Show_task_description(0,0);
    }
  }
  //functional methods
  handle_request_error(err_:boolean,alert_msg:any)
  {
    this.err = err_;
    this.errorAlert = alert_msg;
  }
  Reload_tasks(ms:number){
    setTimeout(()=>{
      this.viewing_task = 0;
      this.tasks_ = [];
      this.Get_tasks();
    },ms);
  }
}

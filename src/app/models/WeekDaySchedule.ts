import { Timeslot } from "./Timeslot";
export class WeekDaySchedule{
    public TimeSlots:Timeslot[] = [];
    constructor(    
        public isEmpty:boolean
        ){}
}
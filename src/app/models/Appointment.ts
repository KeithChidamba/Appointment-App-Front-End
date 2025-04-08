export class Appointment{
    constructor(    
        public  AppointmentID: number,
        public  ClientFirstName:string,
        public  ClientLastName:string,
        public  ClientEmail:string,
        public  ClientPhone:string,
        public  AppointmentDate:string,
        public  AppointmentTime:string,
        public  DateTimeWhenBooked:string,
        public  AppointmentPrice:number,
        public  AppointmentName:string,
        public  AppointmentDurationInMinutes:number,
        public  isConfirmed:number,
        public  BusinessID:number){}
}
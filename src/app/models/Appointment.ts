export class Appointment{
    constructor(    
        public  AppomentID: number,
        public  ClientFirstName:string,
        public  ClientLastName:string,
        public  ClientEmail:string,
        public  ClientPhone:string,
        public  AppomentDate:string,
        public  AppomentTime:string,
        public  DateTimeWhenBooked:string,
        public  AppomentPrice:number,
        public  AppomentName:string,
        public  AppomentDurationInMinutes:number,
        public  isConfirmed:boolean,
        public  BusinessID:number){}
}
import { AppointmentTypeData } from "../models/AppointmentTypeInfo";

export class AvailableAppointments{
   public static List:AppointmentTypeData[]=[new AppointmentTypeData("Gel",45,120),
        new AppointmentTypeData("Manicure" ,60,200),
        new AppointmentTypeData("Pedicure",55,300) ];
}
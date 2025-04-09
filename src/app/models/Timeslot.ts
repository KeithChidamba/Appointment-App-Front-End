import { Appointment } from "./Appointment";

export class Timeslot{
    public StylingSlotHeight:string='';
    public  isBlank:boolean=true;
    constructor(    
        public StartTime:string,
        public  EndTime:string,
        public  DateOfSlot:string,
        public  CurrentAppointment:Appointment | null,
        public  SizeMulitplier:number){this.SetStyling()}
        SetStyling(){
            var BaseSlotHeight = 50;
            var SlotHeight = parseFloat(this.SizeMulitplier.toFixed(2))*BaseSlotHeight;
            this.isBlank = true;
            var ColorIntensity = 0;
            if(this.CurrentAppointment==null){//only color appointment blocks
                this.StylingSlotHeight =  `height:${SlotHeight}px;`;return;
            }
            var ColorSpectrum:string[]= ["rgb(255, 255, 0)","rgb(255, 165, 0)","rgb(212, 79, 30)","rgb(143, 4, 4)","rgb(0, 0, 0)"];
            var TextColorSpectrum:string[] = ["black", "black", "white", "white", "white"];
            var bracket1 = parseFloat(this.SizeMulitplier.toFixed(2))/3; 
            var SlotDurationPercentage:number = Math.round(bracket1*100);
            if(SlotDurationPercentage>100){    
                ColorIntensity=4;
            }else{  
                if(SlotDurationPercentage>=25){
                    ColorIntensity = Math.round(SlotDurationPercentage/25);
                }
            }
            this.StylingSlotHeight = `height:${SlotHeight}px;background-color:${ColorSpectrum[ColorIntensity]};color:${TextColorSpectrum[ColorIntensity]};`;

        }
}

import { Appointment } from "./Appointment";

export class Timeslot{
    public StylingSlotHeight:string='';
    public  isBlank:boolean=true;
    constructor(    
        public StartTime:string,
        public  EndTime:string,
        public  dayIndexOfSlot:number,
        public  CurrentAppointment:Appointment | null,
        public  SizeMulitplier:number){this.SetStyling()}
        SetStyling(){
            var BaseSlotHeight = 53.5;
            var SlotHeight = (parseFloat(this.SizeMulitplier.toFixed(2))*BaseSlotHeight);
            this.isBlank = (this.CurrentAppointment==null);
            var ColorIntensity = 0;
            if(this.isBlank){//only color appointment blocks
                this.StylingSlotHeight = `cursor:pointer;height:${SlotHeight}px;`;return;
            }
            var ColorSpectrum:string[]= ["rgb(255, 255, 0)","rgb(255, 165, 0)","rgb(212, 79, 30)","rgb(143, 4, 4)","rgb(0, 0, 0)","rgb(131, 64, 255)"];
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
            if(this.CurrentAppointment?.isConfirmed==0){
                ColorIntensity = 5;
            }
            this.StylingSlotHeight = `height:${SlotHeight}px;background-color:${ColorSpectrum[ColorIntensity]};color:${TextColorSpectrum[ColorIntensity]};`;

        }
}

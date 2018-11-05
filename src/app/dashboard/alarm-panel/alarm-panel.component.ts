import { Component, OnInit } from '@angular/core';
import {AlarmService} from "./alarm.service";

@Component({
  selector: 'app-alarm-panel',
  templateUrl: './alarm-panel.component.html',
  styleUrls: [
    './alarm-panel.component.css'
    ]
})

export class AlarmPanelComponent implements OnInit {
  dataSet = [];

   constructor(
     private _alarmService: AlarmService
   ) { }

  ngOnInit(): void {

    // this._alarmService.getAlarmInfo()
    //    .subscribe(alarm => {
    //      console.log(alarm);   
    //      this.alarms.push(alarm);     
    //      console.log(this.alarms);
    //    });
    
   
            this._alarmService.getAlarmInfo()
               .subscribe(alarm => {
                 console.log(alarm);
                  this.dataSet.push(
                     {
                       time   :alarm.startTs,
                      status  :alarm.status,
                      type    :alarm.type,
                      device  :alarm.device,
                    });     
                 });
         
  }
}
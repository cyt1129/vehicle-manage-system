import { Component, OnInit, Input } from '@angular/core';
import { Sensor } from '../../model/sensor';
import { WebsocketService } from '../../websocket.service';

@Component({
  selector: 'app-obd-panel',
  templateUrl: './obd-panel.component.html',
  styleUrls: ['./obd-panel.component.css']
})
export class ObdPanelComponent implements OnInit {

  @Input() sensors:Sensor[];
  showTable:boolean = false;

  constructor(
    private _websockectService:WebsocketService
  ) {}

  ngOnInit() {

    this._websockectService.valSubject.map((msg)=>{
      this.sensors.forEach((sensor)=>{
        if(msg.name == `${sensor.key}@${sensor.parentInfo.entityId}`){
          sensor.data = msg.data;
        }
        return sensor;
      })
    }).subscribe(()=>{
      this.showTable = true;
    }
    );

  }

  calWidth(data:string):string{
    var result = parseInt(data)/100*100 + '%';
    return result;
  }

}

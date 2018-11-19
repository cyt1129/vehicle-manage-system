import { Component, OnInit, Input ,OnChanges, SimpleChange} from '@angular/core';
import { Sensor } from '../model/sensor';
import { Subregion } from '../model/subregion';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-obdindb',
  templateUrl: './obdindb.component.html',
  styleUrls: ['./obdindb.component.css']
})
export class ObdindbComponent implements OnInit {

  @Input() subregion:Subregion;
  public sensors:Sensor[]=[];

  constructor(private _websocketService:WebsocketService) { }

  ngOnInit() {
  }

  ngOnChanges(changes:{[propKey:string]:SimpleChange}){
    console.log(changes);
    console.log(changes.subregion.currentValue);
    if(!changes.subregion.firstChange){
      this.sensors = changes.subregion.currentValue.sensors.filter((sensor)=>{
          return sensor.category == "OBDsensor";
      });
      console.log(this.sensors);
      this._websocketService.getLatestDeviceDataByDeviceIds(changes.subregion.currentValue.entityIds);
      /**启用websockect服务获取实时data */
      /*
      this._websockectService.valSubject.map((msg)=>{
        this.sensors.forEach((sensor)=>{
          if(msg.name == `${sensor.key}@${sensor.parentInfo.entityId}`){
            sensor.data = msg.data;
          }
          return sensor;
        })
      }).subscribe();
      */
    }
  }

}

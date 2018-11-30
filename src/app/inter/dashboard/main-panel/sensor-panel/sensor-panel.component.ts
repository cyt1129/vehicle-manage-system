import {Component, Input, OnInit} from "@angular/core";
import {Sensor} from "../../model/sensor";
import {WebsocketService} from "../../websocket.service";

@Component({
  selector: 'app-sensor-panel',
  templateUrl: './sensor-panel.component.html',
  styleUrls: ['./sensor-panel.component.css']
})
export class SensorPanelComponent implements OnInit {

  @Input() sensorList: Sensor[];

  constructor(private _websocketService: WebsocketService) {
  }

  ngOnInit() {
    console.info(this.sensorList);
  }

  foo(): boolean {
    return this.sensorList.length > 0;
  }

  periodChanged({sensor,timeOption}) {
    console.log(sensor);
    console.log(timeOption);
    this._websocketService.historicalSubject.next(sensor);
    this._websocketService.getHistoryDataByDeviceId(sensor.parentInfo.entityId,sensor.key,timeOption);
  }
}

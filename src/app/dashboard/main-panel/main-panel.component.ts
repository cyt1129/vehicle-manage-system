import {Component, OnInit, Output, EventEmitter} from "@angular/core";
import {Subregion} from "../model/subregion";
import {Sensor} from "../model/sensor";
import {WebsocketService} from "../websocket.service";

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css']
})
export class MainPanelComponent implements OnInit {

  @Output() sensorClkEvent = new EventEmitter<Sensor>();

  public subregion: Subregion;
  public isShow: boolean = false;

  private _sensors: Sensor[];

  normalSensors: any[] = [];
  controllers: any[] = [];
  ampereSensors: any[] = [];

  constructor(private _websocketService: WebsocketService) {
  }

  ngOnInit() {
    this._sensors = this.subregion.sensors;
    console.log(this._sensors);
    this._sensors.map(sensor => {
      if(sensor.category == "sensor")
        this.normalSensors.push(sensor);
      if(sensor.category == "controller")
        this.controllers.push(sensor);
      if(sensor.category == "amperemeter")
        this.ampereSensors.push(sensor);
    });
    console.log("this.subregion:"+this.subregion);
    this._websocketService.getLatestDeviceDataByDeviceIds(this.subregion.entityIds);

    // console.log("sensors:" + JSON.stringify(this.normalSensors));
    // console.log("controllers:" + JSON.stringify(this.controllers));
    // console.log("amp sensors:" + JSON.stringify(this.ampereSensors));
  }

}

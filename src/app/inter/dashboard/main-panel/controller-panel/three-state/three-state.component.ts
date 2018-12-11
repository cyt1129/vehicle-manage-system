import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Sensor} from "../../../model/sensor";
import {WebsocketService} from "../../../websocket.service";
import {Headers, Http, RequestOptions} from "@angular/http";
import {TimeoutError} from "rxjs/Rx";
import {isNullOrUndefined} from "util";
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-three-state',
  templateUrl: './three-state.component.html',
  styleUrls: ['./three-state.component.css']
})
export class ThreeStateComponent implements OnInit {

  @Input() threeStatController: Sensor;
  @Input() ampSensors: Sensor[];

  @Output() threeStatChkEvent = new EventEmitter();

  public latestGatherTime: number;

  public light: string;
  public message: string;

  //CSS定义   stop反转  open正转  close停
  //JSON定义  off反转   on正转    stop停
  public openGlitterLight: string = "";
  public stopGlitterLight: string = "";
  public closeGlitterLight: string = "";

  public openCurAmp: number;
  public openCurAmpUnit: string;
  public openMaxAmp: number;
  public openMaxAmpUnit: string;
  public closeCurAmp: number;
  public closeCurAmpUnit: string;
  public closeMaxAmp: number;
  public closeMaxAmpUnit: string;

  public isChecked: boolean = false;

  private httpOption: RequestOptions;
  private rpcLock: boolean = false;

  constructor(private _websocketService: WebsocketService,
              private _http: Http) {
    let token = localStorage.getItem("token");
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer ' + token
    });
    this.httpOption = new RequestOptions({
      headers: headers
    });
  }

  ngOnInit() {
    console.log(this.threeStatController);
    // stat
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.threeStatController.key}@${this.threeStatController.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
        this.latestGatherTime = data.time;

        if (data.data == this.threeStatController.config.on || data.data == this.threeStatController.config.batch_on) {
          this.light = "open";
          this.message = "正转成功";
        } else if (data.data == this.threeStatController.config.off || data.data == this.threeStatController.config.batch_off) {
          this.light = "stop";
          this.message = "反转成功";
        } else if (data.data == this.threeStatController.config.stop || data.data == this.threeStatController.config.batch_stop) {
          this.light = "close";
          this.message = "停止成功";
        } else {
          this.light = "";
          this.message = "状态错误";
        }
      });

    // on_cur_key
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.threeStatController.config.on_cur_key}@${this.threeStatController.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
        console.log(data);

        this.openCurAmp = data.data;
        let currentAmp = this.getAmpSensorByKey(this.threeStatController.config.on_cur_key);
        this.openCurAmpUnit = currentAmp.config.unit;
      });

    // off_cur_key
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.threeStatController.config.off_cur_key}@${this.threeStatController.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
        console.log(data);
        this.closeCurAmp = data.data;
        let currentAmp = this.getAmpSensorByKey(this.threeStatController.config.off_cur_key);
        this.closeCurAmpUnit = currentAmp.config.unit;
      });

    // max_on_cur_key
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.threeStatController.config.max_on_cur_key}@${this.threeStatController.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
        console.log(data);
        this.openMaxAmp = data.data;
        let currentAmp = this.getAmpSensorByKey(this.threeStatController.config.max_on_cur_key);
        this.openMaxAmpUnit = currentAmp.config.unit;
      });

    // max_off_cur_key
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.threeStatController.config.max_off_cur_key}@${this.threeStatController.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
        console.log(data);
        this.closeMaxAmp = data.data;
        let currentAmp = this.getAmpSensorByKey(this.threeStatController.config.max_off_cur_key);
        this.closeMaxAmpUnit = currentAmp.config.unit;
      });
  }

  onCtrlBtnClick(cmd: string): void {

    if (this.rpcLock) {
      return;
    }

    this.rpcLock = true;
    let API_URL = `${environment.serverUrl}/plugins/rpc/twoway/${this.threeStatController.parentInfo.entityId}`;
    console.log("sending RPC via: " + API_URL);
    let method = this.threeStatController.config.control_addr;
    let params = this.threeStatController.config[cmd];
    if(isNullOrUndefined(params)){
      console.log("params illegal!");
      this.rpcLock = false;
      return;
    }
    let jsonStr = `{"method":"${method}","params":"${params}"}`;

    this._http.post(API_URL, jsonStr, this.httpOption)
      .timeout(10 * 1000)
      .subscribe(
        response => {
          console.info(response);

          this.openGlitterLight = "";
          this.closeGlitterLight = "";
          this.stopGlitterLight = "";

          this.rpcLock = false;
        },
        err => {
          if (err instanceof TimeoutError) {
            console.log("time out");
            this.latestGatherTime = new Date().getTime();
            this.message = "指令超时";

            this.openGlitterLight = "";
            this.closeGlitterLight = "";
            this.stopGlitterLight = "";
          }
          this.rpcLock = false;
        }
      );

    if (cmd == "on" || cmd == "batch_on") {
      this.openGlitterLight = "glitter";
    } else if (cmd == "stop" || cmd == "batch_stop") {
      this.closeGlitterLight = "glitter";
    } else if (cmd == "off" || cmd == "batch_off") {
      this.stopGlitterLight = "glitter";
    }
  }

  onChkBoxClk(ele: HTMLInputElement) {
    this.isChecked = ele.checked;
    this.threeStatChkEvent.emit();
  }

  private getAmpSensorByKey(key: string): Sensor {
    return this.ampSensors.filter(s => s.key == key)[0];
  }
}

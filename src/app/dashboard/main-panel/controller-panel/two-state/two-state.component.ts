import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {WebsocketService} from "../../../websocket.service";
import {Sensor} from "../../../model/sensor";
import {Headers, Http, RequestOptions} from "@angular/http";
import "rxjs/add/operator/timeout";
import {TimeoutError} from "rxjs/Rx";
import {isNullOrUndefined} from "util";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-two-state',
  templateUrl: './two-state.component.html',
  styleUrls: ['./two-state.component.css']
})
export class TwoStateComponent implements OnInit {

  @Input() twoStatController: any;
  @Input() ampSensors: any;

  @Output() twoStatCkfEvent = new EventEmitter();

  public latestGatherTime: number;

  public light: string;
  public message: string;

  public onGlitterLight: string = "";
  public offGlitterLight: string = "";

  public curAmp: number;
  public curAmpUnit: string;
  public maxAmp: number;
  public maxAmpUnit: string;

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
    console.log(this.twoStatController);
    // console.log(this.ampSenor);

    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.twoStatController.key}@${this.twoStatController.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
        // console.log(data);
        this.latestGatherTime = data.time;

        if (data.data == this.twoStatController.config.on || data.data == this.twoStatController.config.batch_on) {
          this.light = "open";
          this.message = "开启成功";
        } else if (data.data == this.twoStatController.config.stop || data.data == this.twoStatController.config.batch_stop) {
          this.light = "stop";
          this.message = "关闭成功";
        } else {
          this.light = "";
          this.message = "状态错误";
        }
      });

    // cur_key
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.twoStatController.config.cur_key}@${this.twoStatController.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
        // console.log(data);
        this.curAmp = data.data;
        let currentAmp = this.getAmpSensorByKey(this.twoStatController.config.cur_key);
        // console.log(currentAmp);
        this.curAmpUnit = currentAmp.config.unit;
      });

    // max_cur_key
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.twoStatController.config.max_cur_key}@${this.twoStatController.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
        this.maxAmp = data.data;
        let maxAmp = this.getAmpSensorByKey(this.twoStatController.config.max_cur_key);
        // console.log(maxAmp);
        this.maxAmpUnit = maxAmp.config.unit;
      });

  }

  onCtrlBtnClk(cmd: string): void {

    if(this.rpcLock){
      return;
    }
    this.rpcLock = true;
    let API_URL = `http://${environment.serverUrl}/api/plugins/rpc/twoway/${this.twoStatController.parentInfo.entityId}`;
    console.log("sending RPC via: " + API_URL);
    let method = this.twoStatController.config.control_addr;
    let params = this.twoStatController.config[cmd];
    if(isNullOrUndefined(params)) {
      console.log("params illegal!");
      this.rpcLock = false;
      return;
    }
    let jsonStr = `{"method":"${method}","params":"${params}"}`;
    console.log("RPC body: " + jsonStr);

    if(cmd == "on" || cmd == "batch_on") {
      this.onGlitterLight = "glitter";
    }else if(cmd == "stop" || cmd == "batch_off"){
      this.offGlitterLight = "glitter";
    }

    this._http.post(API_URL, jsonStr, this.httpOption)
      .timeout(10 * 1000)
      .subscribe(
        response => {
          console.info(response);

          this.onGlitterLight = "";
          this.offGlitterLight = "";

          this.rpcLock = false;
        },
        err => {
          if (err instanceof TimeoutError){
            console.log("time out");
            this.latestGatherTime = new Date().getTime();
            this.message = "指令超时";

            this.onGlitterLight = "";
            this.offGlitterLight = "";
          }
          this.rpcLock = false;
        }
      );
  }

  onChkboxClk(ele: HTMLInputElement){
    this.isChecked = ele.checked;
    this.twoStatCkfEvent.emit();
    // console.log('event fired');
  }

  private getAmpSensorByKey(key: string): Sensor {
    return this.ampSensors.filter(s => s.key == key)[0];
  }
}

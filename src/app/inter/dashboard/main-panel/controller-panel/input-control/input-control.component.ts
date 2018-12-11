import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Headers, Http, RequestOptions } from "@angular/http";
import { TimeoutError } from 'rxjs';
import { environment } from "../../../../../../environments/environment";
import { WebsocketService } from '../../../websocket.service';

@Component({
  selector: 'app-input-control',
  templateUrl: './input-control.component.html',
  styleUrls: ['./input-control.component.css']
})
export class InputControlComponent implements OnInit {

  @Input() inputController:any;
  @Input() ampSensors:any;

  private rate = new FormControl('');
  private latestGatherTime:any;
  private rpcLock:boolean //如果一个xhr请求正在发送还没有response，要锁住rpcLook让下一次请求不能发送
  private attention:string = '';//提示用户输入格式错误
  private httpOption:RequestOptions;
  private rateValue:string = '';

  constructor(
    private _http:Http,
    private _websocketService: WebsocketService,
  ) {
    this.rpcLock = false;
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
    //console.log(this.rate);
    this._websocketService.valSubject
        .filter(msg=>msg.name == `${this.inputController.key}@${this.inputController.parentInfo.entityId}`)
        .map(msg =>msg.data)
        .subscribe(msg =>{
          this.rateValue = msg.data;
        })
  }

  private sendCmd(value:any){
    if(this.rpcLock){
      return;
    }
    this.rpcLock = true;
    //判断params是否合法
    let reg = /^[0-9]+$/;
    if(!reg.test(value)){
      this.attention = "请输入正确的数字";
      this.rpcLock = false;
      return;
    }
    let API_URL = `${environment.serverUrl}/plugins/rpc/twoway/${this.inputController.parentInfo.entityId}`;
    console.log("sending RPC via: " + API_URL);
    let method = this.inputController.config.control_addr; //H2108
    let params = value; //60s

    let jsonStr = `{"method":"${method}","params":"${params}"}`;
    console.log("RPC body: " + jsonStr);

    this._http.post(API_URL, jsonStr, this.httpOption)
      .timeout(5 * 1000)
      .subscribe(
        response => {
          console.info(response);

          this.rpcLock = false;
        },
        err => {
          if (err instanceof TimeoutError){
            console.log("time out");
            this.latestGatherTime = new Date().getTime(); 

          }
          this.rpcLock = false;
        }
      );
  }

 
}

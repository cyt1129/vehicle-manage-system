import { Injectable } from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {Subject} from "rxjs/Subject";
import {UserService} from "../../user/login/service/user.service";
import {GPS} from "../gps-panel/model/gps";
import { Message } from '../model/message';
import { Point } from 'angular2-baidu-map';
import { GpsCoordService } from './gps-coord.service';
import { Marker } from './model/marker';
/**
 * gpsService基本没用用于单个点显示的，大地图里没有用到这个service，出了一个GPSGenerator
 */
@Injectable()
export class GpsService {

  GPSList:GPS[]=[];
  //public realSubject: Subject<Message> = new Subject();
  public gpsSubject: Subject<Message> = new Subject();

  constructor(//private _http: Http,
    private _userService: UserService,
    private _websocketService: WebsocketService,
    private _gpsCoordService:GpsCoordService) {
      //this.getGPSAttrFromWs();//从websocket获取所有的GPS属性,给总的gps模块用的
      this.getRealTimeGPSDataFromWs();
}

  getRealTimeGPSDataFromWs():void{
    let list = this.GPSList;
    //for(let i = 0;i<list.length;i++){//不会进入for循环，在subscribe里面for循环
      console.log(list);
      this._websocketService.valSubject
        .filter(msg => {
          let flg = false;
          for(let tmp in list){
            if(msg.name == `${list[tmp].key}@${list[tmp].parentInfo.entityId}`){
              flg = true;
              this.GPSList[tmp].data = msg.data;
              this.GPSList[tmp].point = this.handleGPSRawdata(msg.data.data);
              this.gpsSubject.next(new Message(`${this.GPSList[tmp].parentInfo.entityId}`,this.GPSList[tmp]))//存到gps订阅号里
              console.log(this.GPSList);
              //console.log(msg);
              break;
            }
          }
          return flg;
        })//这里的subscribe删掉试试,好像是不能删除的！！！
        .subscribe();
  }

  //获取用户下所有的gps
  getGPSAttrFromWs(): Subject<GPS[]> {
    let subject = new Subject<GPS[]>();
    this._websocketService.attrSubject //sttr里装的是sensorCfg，message格式：name，data
        .filter(msg => msg.name == "sensorCfg")
        .map(msg => {
          //console.log(msg.data);
          return msg.data;
        })
        .filter(data => data.category == "gps")//取出gps传感器的cfg
        .subscribe(GPSCfgStr => {
          console.log(GPSCfgStr);
          this.GPSList.push(this._gpsCoordService.GPSGenerator(GPSCfgStr));
          
        });

    subject.next(this.GPSList);
    return subject;
  }
  

  
  handleGPSRawdata(data:string):Point{
    //let data="$GNRMC,070203.000,A,3015.8482,N,12007.0309,E,0.00,0.00,310718,,,A*75";
    let strArray = data.split(",");
    let y = parseFloat(strArray[5]);//原始经度
    let x = parseFloat(strArray[3]);//原始纬度
    let y_z = parseInt((y/100).toString());//取经度整数部分
    let x_z = parseInt((x/100).toString());//取维度整数部分
    x = (x-x_z*100)/60+x_z;
    y = (y-y_z*100)/60+y_z;
    let p:Point;
    p = this._gpsCoordService.gps84_To_Bd09(x,y);
    //console.log(p);
    //marker.lat=30;
    return p;
  }
  

}

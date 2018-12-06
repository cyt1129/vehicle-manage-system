import {Injectable} from "@angular/core";
import {Http,Headers,RequestOptions} from "@angular/http";
import {environment} from "../../../../environments/environment";

import "rxjs/add/operator/toPromise";
//import {Token} from "../../../user/login/model/token";
import {Subject} from "rxjs/Subject";
//import {Message} from "../../dashboard/model/message";
import {UserService} from "../../../user/login/service/user.service";
import {Alarm} from "../alarm-panel/model/alarm";

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import { catchError } from 'rxjs/operators';

@Injectable()
export class AlarmService {
 // private AlarmUrl =  "http://" + environment.serverUrl + "/api/plugins/telemetry/DEVICE";
 private AlarmUrl =   environment.serverUrl + "/alarm/DEVICE";
 private DeviceInfo = environment.serverUrl + "/device/";
 private httpOption: RequestOptions;
 private attributeUrl = environment.serverUrl + "/plugins/telemetry/DEVICE";


  constructor(
    private _http: Http,
    private _userService: UserService
  ) { 
    let token = localStorage.getItem("token");
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer ' + token
    });
    this.httpOption = new RequestOptions({
      headers: headers
    });
  }

  //得到设备名称
  getDeviceName(deviceid:string): Observable<any>{
    return this._http
               .get(this.DeviceInfo + deviceid,
                this.httpOption)
                .map(response => {
                  let deviceName = response.json().name;
                  return deviceName;
                });
                //清楚警告，需要用到alarmID
                //http://140.143.23.199:8080/api/alarm/545e2aa0-8577-11e8-ad4b-4dd707116a31/clear
  }

  getAlarmInfo(): Subject<Alarm> {

    const subject = new Subject<Alarm>();
    
    this._userService.getUserInfo()
      .filter(message => {
        return message.name === 'deviceList';
      })
      .map(message => message.data)
      .subscribe(deviceids => {
        console.log(deviceids);
        // this.deviceId = new Set(deviceids);
       // console.log(deviceIds);
        deviceids.forEach(deviceid => {
          //查询设备名称
          this._http.get(this.DeviceInfo + deviceid,this.httpOption).toPromise()
              .then(response=>{
                let deviceInfo = response.json();
                let deviceName = deviceInfo.name;
                let device = [deviceid,deviceName];
                return device;
              })
              .then(device=>{
                //查询设备的alarm消息
                this._http.get(this.AlarmUrl+'/'+device[0] +'?limit=50&ascOrder=false', this.httpOption)
                    .toPromise().then(response=>{
                      var alarmList = [];
                      let array = [];
                      response.json().data.filter(msg=>{
                        //选出属于当前设备的报警消息
                        return `${msg.originator.id}` == device[0];
                      }).map(msg=>{
                        //console.log(msg);
                        
                        let alarm = new Alarm();
                        alarm.startTs = msg.startTs;
                        alarm.device = device[1];
                        alarm.alarmType = msg.type; //rule里面要改成H0900....
                        alarm.type = msg.details.message;
                        alarm.deviceId = device[0];
                        
                        alarm.status = msg.status;
                        alarmList.push(alarm);
                        //subject.next(alarm);//一会要注销
                      });
                      
                      return alarmList;
                    }).then(alarmList=>{
                      //let deviceid = JSON.stringify(alarmList[0].deviceId);
                      //console.log(deviceid);
                      //查询属性名称
                        this._http.get(this.attributeUrl + '/'+alarmList[0].deviceId + '/values/attributes/SERVER_SCOPE',this.httpOption)
                            .toPromise().then(response=>{
                              var arrList = response.json();
                              console.log(arrList);
                              
                              alarmList.map(alarm =>{
                                let attr = arrList.filter(attr=>{
                                  return `${attr.key}` == alarm.type;
                                });
                                console.log(alarm.alarmType,attr);
                                if(attr.length !== 0){
                                  attr = JSON.parse(attr[0].value);
                                  alarm.type = attr.name;
                                  //console.log(attr);
                                }
                                
                                subject.next(alarm);
                              });                            
                            });                   
                    });
              });
          });
        });
          return subject;
      }           
}
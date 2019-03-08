import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SubmittedFormOption } from './model/submitted-form-option';
import { environment } from "../../../environments/environment";
import { SubmittedForm } from './model/submitted-form';
import { TimeoutError, Subject } from "rxjs/Rx";
//import { Message } from '../dashboard/model/message';

@Injectable()
export class VehicleService {

  constructor(private _http: Http) { }

  private vehicleModelUrl = `${environment.obd_serverUrl}/registry/vehicleModel`;
  private authUrl = `${environment.obd_serverUrl}/registry/auth`;
  private authStatusUrl = `${environment.obd_serverUrl}/registry/auth/status`;
  /**
   * 查询设备型号
   * @param value 
   */
  getVehicleModel(value): Subject<SubmittedForm> {
    let subject = new Subject<any>();
    let form = null;
    //let url = "http://localhost:8080/obd/registry/vehicleModel";
    let jsonStr = JSON.stringify(value);
    this._http.post(this.vehicleModelUrl, jsonStr)
      .timeout(10 * 1000)
      .subscribe(
        response => {
          console.info(response.json());
          if (response.status == 200) {
            let body = response.json();
            if (body.status == '-1') {
              alert("未找到此车辆类型")
            } else {
              let vehicleModel = body.vehicleModel;
              let body_optional = vehicleModel.optional;
              let optional_array = body_optional.substring(1, body_optional.length - 1).split(",");

              let option = new SubmittedFormOption();
              optional_array.map(str => {
                let keyValuePair = str.split("=");
                option[keyValuePair[0].trim()] = keyValuePair[1];
              });

              form = vehicleModel;
              form.optional = option;
              console.log(form);
              subject.next(form);
            }
          } else {
            Promise.reject("login failed!");
            alert("操作失败");
          }
        },
        err => {
          if (err instanceof TimeoutError) {
            console.log("time out");
            alert("请求超时，操作失败");
          }
          else {
            alert("操作失败");
          }
        }
      );
    return subject;
  }

  /**
   * 
   * @param value 车辆鉴权
   */
  submitVehicle(value): Subject<Object> {
    //console.log(this.form);
    //清洗发出去的数据的optional，form的optional不用清洗，所以form是从value深拷贝来的
    var newOptional = {};
    let optionalNum = 0;
    Object.keys(value.optional).forEach(key => {
      if (value.optional[key] !== "") {
        newOptional[key] = value.optional[key];
        optionalNum += 1;
      }
    })
    if (optionalNum > 0) {
      value.optional = newOptional;
    } else {
      delete value.optional;
    }
    console.log(value);


    var jsonStr = JSON.stringify(value)
    let subject = new Subject<Object>();
    this._http.post(this.authUrl, jsonStr)
      .timeout(10 * 1000)
      .subscribe(
        response => {
          let body = response.json();
          console.log(body);
          if (response.status == 200) {
            alert(body.sbbh + "\n" + body.statusInfo + "\n" + body.sqlInfo);
            subject.next(body);
          } else {
            Promise.reject("login failed!");
            alert("操作失败");
          }
        },
        err => {
          if (err instanceof TimeoutError) {
            console.log("time out");
            alert("请求超时，操作失败");
          }
          else {
            alert("操作失败");
          }
        }
      );
    return subject;
  }

  queryAuthStatus(value):void{
    //console.log(value);
    if (value.clsbhm.trim().length !== 17) {
      alert("车架号不合法，请输入正确车架号");
      return;
    }
    let jsonStr = JSON.stringify(value);
    //let url = "http://localhost:8080/obd/registry/auth/status";
    //this.queryAuthVehicle_url
    this._http.post(this.authStatusUrl, jsonStr)
      .timeout(10 * 1000)
      .subscribe(response => {
        if (response.status == 200) {
          let body = response.json();
          console.log(body);
          if (body.status == '0') {
            let vehicle = body.vehicle;
            alert('该车辆已鉴权！' + '\n车架号:' + body.clsbhm + '\n设备编号:' + vehicle.sbbh + '\n品牌:' + vehicle.clpp + '\n车辆型号:' + vehicle.clxh + '\n鉴权时间:' + this.formatDateTime(vehicle.obdauth));
          } else {
            //this.queryAuthResult = '设备编号:'+ body.sbbh + ' 品牌:'+ body.clpp +'\n车辆型号:'+ body.clxh +' 鉴权时间:'+body.obdauth;
            alert("该车未鉴权!");
          }
        }
      },
        err => {
          if (err instanceof TimeoutError) {
            console.log("time out");
            alert("请求超时");
          }
          else {
            alert("请求失败");
          }
        });
  }

  trim(value: string): string {
    //if(value !==""){
    //return value.replace(/(^\s*)|(\s*$)/g, "");  
    //}
    return value;
  }

  formatDateTime(time: string): string {
    let unixtime = new Date(parseInt(time));
    let y = unixtime.getFullYear();
    let mo = unixtime.getMonth() + 1;
    let m = mo < 10 ? ('0' + mo) : mo;
    let day = unixtime.getDate();
    let d = day < 10 ? ('0' + day) : day;
    let hour = unixtime.getHours();
    let h = hour < 10 ? ('0' + hour) : hour;
    let mi = unixtime.getMinutes();
    let se = unixtime.getSeconds();
    let minute = mi < 10 ? ('0' + mi) : mi + '';
    let second = se < 10 ? ('0' + se) : se;
    //console.log(y,m,d,h);
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
}

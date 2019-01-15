import { Component, OnInit, Optional } from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import {TimeoutError} from "rxjs/Rx";
import { SubmittedForm } from '../model/submitted-form';
import { SubmittedFormOption } from '../model/submitted-form-option';

@Component({
  selector: 'app-device-register',
  templateUrl: './device-register.component.html',
  styleUrls: ['./device-register.component.css']
})
export class DeviceRegisterComponent implements OnInit {

  constructor(private _http: Http) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',  
      'Accept-Type':'application/json',
    });
    this.httpOption = new RequestOptions({
      headers: headers,
    });

    this.form = new SubmittedForm();
    console.log(this.form);
   }

  private success = false;
  private httpOption: RequestOptions;
  private auth_url = "http://140.143.23.199:8090/jima/obd/registerDevice";
  private query_url = "http://140.143.23.199:8090/jima/obd/queryVehicleType";
  
  private form :SubmittedForm;
  private queryTypeResult:string = "";


  ngOnInit() {
    //this.form = new SubmittedForm();
    //console.log(this.form);
  }

  onSubmit(value){

    let _form = JSON.stringify(value);
    this.form = JSON.parse(_form);
    if(this.trim(value.SBBH) == ""){
      alert("请填写设备编号");
      return;
    }
    if(this.trim(value.CLXH) == ""){
      alert("请填写车辆型号");
      return;
    }
    if(value.CLPP == ""){
      alert("请填写车辆品牌");
      return;
    }
    if(this.trim(value.CLSBHM) == "" ){
      alert("请填写车架号");
      return;
    }
    if(value.CLSBHM.trim().length !== 17){
      alert("车架号不合法，请重新输入");
      return;
    }
    if(this.trim(value.FDJH) == ""){
      alert("请填写发动机号");
      return;
    }
    if(this.trim(value.FDJXH) == ""){
      alert("请填写发动机型号");
      return;
    }
    if(this.trim(value.RLZL) == ""){
      alert("请填写燃料种类");
      return;
    }
    if(this.trim(value.SCRQ) == ""){
      alert("请填写生产/进口日期");
      return;
    }
    if(this.trim(value.PF) == ""){
      alert("请填写排放阶段");
      return;
    }
    if(this.trim(value.SCQYMC) == ""){
      alert("请填写车辆制造商名称");
      return;
    }
    if(this.trim(value.FDJSCC) == ""){
      alert("请填写发动机生产厂");
      return;
    }
    
    console.log(this.form);
    //清洗发出去的数据的optional，form的optional不用清洗，所以form是从value深拷贝来的
    var newOptional = {};
    let optionalNum = 0;
    Object.keys(value.optional).forEach(key=>{
      if(value.optional[key] !== ""){
        newOptional[key] = value.optional[key];
        optionalNum += 1;
      }
    })
    if(optionalNum > 0){
      value.optional = newOptional;
    }else{
      delete value.optional;
    }
    console.log(value);

    
    var jsonStr = JSON.stringify(value)
    //console.log(jsonStr);
    //post到http:140.143.23.199:8090/jima/iot/registerobd,一直有个跨域请求错误
    this._http.post(this.auth_url, jsonStr)
      .timeout(10 * 1000)
      .subscribe(
        response => {
          console.info(response.json());
          if(response.status == 200){
            let body = response.json();
            alert(body.obd +"\n"+body.obderror +"\n"+body.sql);
          }else{
            Promise.reject("login failed!");
            alert("操作失败");
          }
        },
        err => {
          if (err instanceof TimeoutError){
            console.log("time out");
            alert("请求超时，操作失败");
          }
          else{
            alert("操作失败");
          }
        }
      );
  }

  findType(value){
    //往服务器发查询设备型号命令，得到型号的json字符串，往表里面填
    console.log(value);
    let url = "http://localhost:8080/jima/obd/queryVehicleType";
    let jsonStr = JSON.stringify(value)
    this._http.post(this.query_url, jsonStr)
      .timeout(10 * 1000)
      .subscribe(
        response => {
          console.info(response.json());
          if(response.status == 200){
            let body = response.json();
            if(JSON.stringify(body) == '{}'){
              alert("未找到此设备类型")
              this.queryTypeResult = "导出失败,未找到此设备类型";
            }else{
              let body_optional = body.optional;
              let optional_array = body_optional.substring(1,body_optional.length-1).split(",");

              let option = new SubmittedFormOption();
              optional_array.map(str=>{
                 let keyValuePair = str.split("=");
                option[keyValuePair[0].trim()] = keyValuePair[1];
              });

              this.form = body;
              this.form.optional = option;
              console.log(this.form);
              this.queryTypeResult = "导出表格成功";
            }
          }else{
            Promise.reject("login failed!");
            alert("操作失败");
          }
        },
        err => {
          if (err instanceof TimeoutError){
            console.log("time out");
            alert("请求超时，操作失败");
          }
          else{
            alert("操作失败");
          }
        }
      );
  }



  trim(value:string):string{
    //if(value !==""){
      //return value.replace(/(^\s*)|(\s*$)/g, "");  
    //}
      return value;

    
  } 
}

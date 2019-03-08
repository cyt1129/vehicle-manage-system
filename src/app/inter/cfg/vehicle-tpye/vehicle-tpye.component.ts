import { Component, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions } from "@angular/http";
import { TimeoutError } from "rxjs/Rx";
import { SubmittedForm } from '../model/submitted-form';
import { SubmittedFormOption } from '../model/submitted-form-option';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-vehicle-tpye',
  templateUrl: './vehicle-tpye.component.html',
  styleUrls: ['./vehicle-tpye.component.css']
})
export class VehicleTpyeComponent implements OnInit {

  constructor(
    private _http: Http,
    private vehicleService: VehicleService
  ) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Accept-Type': 'application/json',
    });
    this.httpOption = new RequestOptions({
      headers: headers,
    });

    this.form = new SubmittedForm();
    //console.log(this.form);
  }
  private httpOption: RequestOptions;
  private form: SubmittedForm;
  private queryTypeResult: string = "";
  private insert_url = "http://140.143.23.199:8090/jima/obd/insertVehicleType";
  private query_url = "http://140.143.23.199:8090/jima/obd/queryVehicleType";

  ngOnInit() {
  }

  findType(value) {
    this.vehicleService.getVehicleModel(value)
        .subscribe(data=>{
          if(data){
            this.form = data;
          }else{
            this.queryTypeResult = "未找到此车辆类型";
          }
        });
    
  }



  addVehicleType(value) {

    let _form = JSON.stringify(value);
    this.form = JSON.parse(_form);
    if (value.CLXH.trim() == "") {
      alert("请填写车辆型号");
      return;
    }
    if (value.CLPP.trim() == "") {
      alert("请填写车辆品牌");
      return;
    }
    if (value.FDJXH.trim() == "") {
      alert("请填写发动机型号");
      return;
    }
    if (value.RLZL.trim() == "") {
      alert("请填写燃料种类");
      return;
    }
    if (value.PF.trim() == "") {
      alert("请填写排放阶段");
      return;
    }
    if (value.SCQYMC.trim() == "") {
      alert("请填写车辆制造商名称");
      return;
    }
    if (value.FDJSCC.trim() == "") {
      alert("请填写发动机生产厂");
      return;
    }

    console.log(this.form);
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
    //console.log(jsonStr);
    //post到http:140.143.23.199:8090/jima/iot/registerobd,一直有个跨域请求错误
    let url = "http://localhost:8080/obd/registry/vehicleModel/insert";
    this._http.post(url, jsonStr)
      .timeout(10 * 1000)
      .subscribe(
        response => {
          console.info(response.json());
          if (response.status == 200) {
            let body = response.json();
            if (body.status == '-1') {
              alert("该型号已存在\n" + body.statusInfo);
            } else {
              alert(body.statusInfo);
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
  }
}

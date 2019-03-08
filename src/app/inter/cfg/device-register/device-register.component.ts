import { Component, OnInit } from '@angular/core';
import { SubmittedForm } from '../model/submitted-form';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-device-register',
  templateUrl: './device-register.component.html',
  styleUrls: ['./device-register.component.css']
})
export class DeviceRegisterComponent implements OnInit {

  constructor(
    private vehicleService: VehicleService
  ) {
    this.form = new SubmittedForm();
    console.log(this.form);
  }

  private form: SubmittedForm;
  private queryTypeResult: string = "";

  ngOnInit() {
    //this.form = new SubmittedForm();
    //console.log(this.form);
  }

  onSubmit(value) {
    console.log(value);
    if (this.trim(value.SBBH) == "") {
      alert("请填写设备编号");
      return;
    }
    if (this.trim(value.CLXH) == "") {
      alert("请填写车辆型号");
      return;
    }
    if (value.CLPP == "") {
      alert("请填写车辆品牌");
      return;
    }
    if (this.trim(value.CLSBHM) == "") {
      alert("请填写车架号");
      return;
    }
    if (value.CLSBHM.trim().length !== 17) {
      alert("车架号不合法，请重新输入");
      return;
    }
    if (this.trim(value.FDJH) == "") {
      alert("请填写发动机号");
      return;
    }
    if (this.trim(value.FDJXH) == "") {
      alert("请填写发动机型号");
      return;
    }
    if (this.trim(value.RLZL) == "") {
      alert("请填写燃料种类");
      return;
    }
    if (this.trim(value.SCRQ) == "") {
      alert("请填写生产/进口日期");
      return;
    }
    if (this.trim(value.PF) == "") {
      alert("请填写排放阶段");
      return;
    }
    if (this.trim(value.SCQYMC) == "") {
      alert("请填写车辆制造商名称");
      return;
    }
    if (this.trim(value.FDJSCC) == "") {
      alert("请填写发动机生产厂");
      return;
    }
    this.vehicleService.submitVehicle(value)
      .subscribe();
  }

  findType(value) {
    this.vehicleService.getVehicleModel(value)
      .subscribe(data => {
        if (data) {
          this.form = data;
        } else {
          this.queryTypeResult = "未找到此车辆类型";
        }
      });
  }


  /**
   * 查询车辆是否已经鉴权
   * @param value 
   */
  queryIfAuthed(value) {
    this.vehicleService.queryAuthStatus(value);
  }


  trim(value: string): string {
    //if(value !==""){
    //return value.replace(/(^\s*)|(\s*$)/g, "");  
    //}
    return value;


  }
}

import { Component, OnInit } from '@angular/core';
import {NgModule} from "@angular/core";
import {Headers, Http, RequestOptions,Jsonp} from "@angular/http";
import {Subject} from "rxjs/Subject";
import {DeviceAttr} from '../model/device-attr';
import {TwoStateConfig} from '../model/two-state-config';
import {ThreeStateConfig} from '../model/three-state-config';
import {Amperemeter} from '../model/amperemeter';
import {AmperemeterConfig} from '../model/amperemeter-config';
import {DeviceAttrConfig} from '../model/device-attr-config';
import {DeviceAttrConfigTrans} from '../model/device-attr-config-trans';
import {environment} from "../../../../environments/environment";
//import { NgFor } from '@angular/common';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import {Device} from '../model/device';
import {Observable} from "rxjs/Observable";


export class DeviceCategory {
  name: string;
}
const DeviceCategoryList: DeviceCategory[] = [
  {  name: '温度' },
  {  name: '湿度' },
  {  name: '光照' },
  {  name: 'CO2' },
  {  name: '溶解氧' },
  {  name: '硫化氢' },
  {  name: '停电指示' },
  {  name: '液位' },
  {  name: '氨气' },
  {  name: '盐分' },
  {  name: 'PH' },
  {  name: '三态可控' },
  {  name: '两态可控' },
  {  name: '压力' },
  {  name: '其他' }
];

@Component({
  selector: 'device-attr-list',
  templateUrl: './device-attr-list.component.html',
  styleUrls: ['../cfg.component.css']
})

@Injectable()
export class DeviceAttrListComponent implements OnInit {

  private httpOption: RequestOptions;
  public deviceAttrList: Array<DeviceAttr> = [];
  private _currentActiveName = "";
  public dkey: string = "";
  deviceCategoryList = DeviceCategoryList;
  public imagename: string = "more";

  public base_add: boolean = false;
  public two_state_add: boolean = false;
  public three_state_add: boolean = false;
  public device_add:boolean = false;
  public cur_device_id = "";

  constructor(private http: Http,private _jsonp: Jsonp) { 
    this.deviceAttrList = [];

    let token = localStorage.getItem("token");
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer ' + token
    });
    this.httpOption = new RequestOptions({
      headers: headers
    });
    this.getUserDevices();
    // this.getDeviceAttrList("a7f4a0c0-2e5e-11e7-8375-673c572a5db7");//3658bfc0-7114-11e7-85b3-673c572a5db7
  }

  getDeviceAttrList(deviceid:string): void {
     this.http.get(`${environment.serverUrl}/plugins/telemetry/DEVICE/`+deviceid+`/values/attributes/SERVER_SCOPE`,this.httpOption)
    .toPromise().then(response => {
    this.deviceAttrList = [];
        let data = response.json();
        for(let tmp in data){
          let attrConfig = new DeviceAttrConfig();
          let _value = JSON.parse(data[tmp].value);
          let type = _value.config.type;
          let trans = _value.config.trans;
          let deviceAttrConfigTrans = new DeviceAttrConfigTrans();
          if(trans !=null){
            deviceAttrConfigTrans.inLow = trans[0];
            deviceAttrConfigTrans.inHig = trans[1];
            deviceAttrConfigTrans.outLow = trans[2];
            deviceAttrConfigTrans.outHig = trans[3];
          }
          attrConfig.trans = deviceAttrConfigTrans;
          
          attrConfig.type=type;
          let name = _value.name;
          attrConfig.unit = _value.config.unit;
          let region = _value.region;
          let lastUpdateTs = data[tmp].lastUpdateTs;
          let key = data[tmp].key;
          let deviceAttr = new DeviceAttr();
          deviceAttr.key=key;
          deviceAttr.name=name;
          deviceAttr.category = _value.category;
          deviceAttr.region=region;
          deviceAttr.lastUpdateTs = lastUpdateTs;
          deviceAttr.config = attrConfig;

          if(_value.category == "amperemeter"){
            deviceAttr.ref_item = _value.config.ref_item;
            deviceAttr.ref_key = _value.config.ref_key;
            deviceAttr.unit = _value.config.unit;
          }
          if(_value.category == "controller"){
            if(type == "三态可控"){
              deviceAttr.on = _value.config.on;
              deviceAttr.control_addr = _value.config.control_addr;
              deviceAttr.off = _value.config.off;
              deviceAttr.stop = _value.config.stop;
              deviceAttr.batch_on = _value.config.batch_on;
              deviceAttr.batch_off = _value.config.batch_off;
              deviceAttr.batch_stop = _value.config.batch_stop;
              deviceAttr.on_cur_key = _value.config.on_cur_key;
              deviceAttr.max_on_cur_key = _value.config.max_on_cur_key;
              deviceAttr.off_cur_key = _value.config.off_cur_key;
              deviceAttr.max_off_cur_key = _value.config.max_off_cur_key;
            }else{
              deviceAttr.on = _value.config.on;
              deviceAttr.control_addr = _value.config.control_addr;
              deviceAttr.stop = _value.config.stop;
              deviceAttr.batch_on = _value.config.batch_on;
              deviceAttr.batch_stop = _value.config.batch_stop;
              deviceAttr.cur_key = _value.config.cur_key;
              deviceAttr.max_cur_key = _value.config.max_cur_key;
            }
          }
          
          this.deviceAttrList.push(deviceAttr);
        }
      });

  }

  detailDevice(deviceAttr:DeviceAttr,imagename:string):void{
      this.imgkey = deviceAttr.key;
      this.dkey = deviceAttr.key;
      this.ukey = "";
  }

  closedetailDevice(deviceAttr:DeviceAttr,imagename:string):void{
      this.imgkey =  "";
      this.ukey = "";
      this.dkey = "";
  }

  public chkkey: Array<string> = [];
  chkall(domElement: HTMLInputElement):void{
    this.chkkey = [];
    if(domElement.checked){
      for(let tmp in this.deviceAttrList){
        let _deviceAttr = new DeviceAttr();
        _deviceAttr = this.deviceAttrList[tmp];
        _deviceAttr.isChecked = true;
        this.chkkey.push(_deviceAttr.key);
      }
    }else{
      for(let tmp in this.deviceAttrList){
        let _deviceAttr = new DeviceAttr();
        _deviceAttr = this.deviceAttrList[tmp];
        _deviceAttr.isChecked = false;
      }
    }
  }

  chkdeviceAttr(key:string,domElement: HTMLInputElement):void{
    let newchkkey = [];
    if(!domElement.checked){
      if(this.chkkey.length>0){
      for(let tmp in this.chkkey){
        let _key = this.chkkey[tmp];
        if(_key != key){
          newchkkey.push(_key);
        }
      }
      this.chkkey = newchkkey;
      }else{
        this.chkkey.push(key);
      }
    }else{
      this.chkkey.push(key);
    }
  }

  unchkall():void{
    this.chkkey = [];
    for(let tmp in this.deviceAttrList){
      let _deviceAttr = new DeviceAttr();
      _deviceAttr = this.deviceAttrList[tmp];
      _deviceAttr.isChecked = false;
      this.chkkey.push(_deviceAttr.key);
    }
  }

  public ukey:string;
  public imgkey:string;

  goupdatedevice(deviceAttr:DeviceAttr):void{
    this.dkey = "";
    this.ukey = deviceAttr.key;
    this.imgkey = deviceAttr.key;
  }

  categoryChange(name:string):void{
    if(name=="两态可控"){
        this.base_add = false;
        this.two_state_add = true;
        this.three_state_add = false;
    }else if(name =="三态可控"){
        this.base_add = false;
        this.two_state_add = false;
        this.three_state_add = true;
    }else{
        this.base_add = true;
        this.two_state_add = false;
        this.three_state_add = false;
    }
  }


  public _key:string;
  public _wdtrans:string;
  public _name:string;
  public _region:string;
  public _category:string;
  public _wdunit:string;

  deleteDevice(): void{
    if(this.chkkey.length>0){
      if(confirm("您确定要删除所选的对象吗？")){
        this.http.delete(`${environment.serverUrl}/plugins/telemetry/`+this.cur_device_id+`/SERVER_SCOPE?keys=`+this.chkkey,this.httpOption).toPromise()
        .then(response => {
          if (response.status == 200) {
            this.undo();
          }
          else {
            Promise.reject("添加失败!");
          }
        })
        .catch(this.handleHttpError)
      }
    }else{
      alert("请选择要删除的对象!");
    }
      
  }

  private handleHttpError(error: any): Promise<any> {
    return Promise.reject(error.json());
  }

  updateDeviceAttr(devicekey:string):void{
    
  }

  updateDeviceAttrSave(domElement: HTMLInputElement):void{
    let edit_deviceAttr = new DeviceAttr();
    let edit_category = domElement["edit_category"].value;
    let edit_key = domElement["edit_key"].value;
    let edit_name = domElement["edit_name"].value;
    let edit_region = domElement["edit_region"].value;
    edit_deviceAttr.key = edit_key;
    edit_deviceAttr.category = edit_category;
    edit_deviceAttr.name = edit_name;
    edit_deviceAttr.region = edit_region;
    let edit_type = domElement["edit_type"].value;
    if(edit_category == "sensor"){
      //传感器
      let edit_unit = domElement["edit_unit"].value;
      let edit_inLow = domElement["edit_inLow"].value;
      let edit_inHigh = domElement["edit_inHigh"].value;
      let edit_outLow = domElement["edit_outLow"].value;
      let edit_outHigh = domElement["edit_outHigh"].value;
      let edit_deviceAttrConfig = new DeviceAttrConfig();
      edit_deviceAttrConfig.type = edit_type;
      edit_deviceAttrConfig.unit = edit_unit;
      edit_deviceAttr.config = edit_deviceAttrConfig;
      let edit_deviceAttrConfigTrans = new DeviceAttrConfigTrans();
      edit_deviceAttrConfigTrans.inLow = edit_inLow;
      edit_deviceAttrConfigTrans.inHig = edit_inHigh;
      edit_deviceAttrConfigTrans.outLow = edit_outLow;
      edit_deviceAttrConfigTrans.outHig = edit_outHigh;
      edit_deviceAttrConfig.trans = edit_deviceAttrConfigTrans;
      edit_deviceAttr.category = "sensor";

      let str = {};
      let cur_key_trans = (edit_inLow !=0 && edit_inHigh !=0
        && edit_outLow !=0 && edit_outHigh !=0);
      if(cur_key_trans){
        str = '{\"'+edit_deviceAttr.key+'\":"{\\"name\\":\\"'+edit_deviceAttr.name+'\\",\\"region\\":\\"'+edit_deviceAttr.region+'\\",\\"category\\":\\"'+edit_deviceAttr.category+'\\",\\"config\\":{\\"type\\":\\"'+edit_deviceAttrConfig.type+'\\",\\"unit\\":\\"'+edit_deviceAttrConfig.unit+'\\",\\"trans\\":['+edit_inLow+','+edit_inHigh+','+edit_outLow+','+edit_outHigh+']}}"}';
      }else{
        str = '{\"'+edit_deviceAttr.key+'\":"{\\"name\\":\\"'+edit_deviceAttr.name+'\\",\\"region\\":\\"'+edit_deviceAttr.region+'\\",\\"category\\":\\"'+edit_deviceAttr.category+'\\",\\"config\\":{\\"type\\":\\"'+edit_deviceAttrConfig.type+'\\",\\"unit\\":\\"'+edit_deviceAttrConfig.type+'\\"}}"}';
      }
      this.addDeviceAttr(str);

    }else if(edit_category == "amperemeter"){
      //电流
      let edit_ref_item = domElement["edit_ref_item"].value;
      let edit_ref_key = domElement["edit_ref_key"].value;
      let edit_unit = domElement["edit_unit"].value;
      let edit_inLow = domElement["edit_inLow"].value;
      let edit_inHigh = domElement["edit_inHigh"].value;
      let edit_outLow = domElement["edit_outLow"].value;
      let edit_outHigh = domElement["edit_outHigh"].value;
      let c_a_str = {};
      let cur_key_trans = (edit_inLow !=0 && edit_inHigh !=0
        && edit_outLow !=0 && edit_outHigh !=0);
      if(cur_key_trans){
        c_a_str = '{\"'+edit_deviceAttr.key+'\":"{\\"name\\":\\"'+edit_deviceAttr.name+'\\",\\"region\\":\\"'+edit_deviceAttr.region+'\\",\\"category\\":\\"'+edit_deviceAttr.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+edit_ref_item+'\\",\\"ref_key\\":\\"'+edit_ref_key+'\\",\\"unit\\":\\"'+edit_unit+'\\",\\"trans\\":['+edit_inLow+','+edit_inHigh+','+edit_outLow+','+edit_outHigh+']}}"}';
      }else{
        c_a_str = '{\"'+edit_deviceAttr.key+'\":"{\\"name\\":\\"'+edit_deviceAttr.name+'\\",\\"region\\":\\"'+edit_deviceAttr.region+'\\",\\"category\\":\\"'+edit_deviceAttr.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+edit_ref_item+'\\",\\"ref_key\\":\\"'+edit_ref_key+'\\",\\"unit\\":\\"'+edit_unit+'\\"}}"}';
      }
      this.addDeviceAttr(c_a_str);
    }else if(edit_category == "controller"){
      if(edit_type == "两态可控"){
        let edit_control_addr = domElement["edit_control_addr"].value;
        let edit_on = domElement["edit_on"].value;
        let edit_stop = domElement["edit_stop"].value;
        let edit_batch_on = domElement["edit_batch_on"].value;
        let edit_batch_stop = domElement["edit_batch_stop"].value;
        let edit_cur_key = domElement["edit_cur_key"].value;
        let edit_max_cur_key = domElement["edit_max_cur_key"].value;
        let c_str = {};
        c_str = '{\"'+edit_deviceAttr.key+'\":"{\\"name\\":\\"'+edit_deviceAttr.name+'\\",\\"region\\":\\"'+edit_deviceAttr.region+'\\",\\"category\\":\\"controller\\",\\"config\\":{\\"type\\":\\"'+edit_type+'\\",\\"control_addr\\":\\"'+edit_control_addr+'\\",\\"on\\":\\"'+edit_on+'\\",\\"stop\\":\\"'+edit_stop+'\\",\\"batch_on\\":\\"'+edit_batch_on+'\\",\\"batch_stop\\":\\"'+edit_batch_stop+'\\",\\"cur_key\\":\\"'+edit_cur_key+'\\",\\"max_cur_key\\":\\"'+edit_max_cur_key+'\\"}}"}';
        this.addDeviceAttr(c_str);
      }else{
        let edit_control_addr = domElement["edit_control_addr"].value;
        let edit_on = domElement["edit_on"].value;
        let edit_off = domElement["edit_off"].value;
        let edit_stop = domElement["edit_stop"].value;
        let edit_batch_on = domElement["edit_batch_on"].value;
        let edit_batch_off = domElement["edit_batch_off"].value;
        let edit_batch_stop = domElement["edit_batch_stop"].value;
        let edit_on_cur_key = domElement["edit_on_cur_key"].value;
        let edit_max_on_cur_key = domElement["edit_max_on_cur_key"].value;
        let edit_off_cur_key = domElement["edit_off_cur_key"].value;
        let edit_max_off_cur_key = domElement["edit_max_off_cur_key"].value;
        let str = {};
        str = '{\"'+edit_deviceAttr.key+'\":"{\\"name\\":\\"'+edit_deviceAttr.name+'\\",\\"region\\":\\"'+edit_deviceAttr.region+'\\",\\"category\\":\\"controller\\",\\"config\\":{\\"type\\":\\"'+edit_type+'\\",\\"control_addr\\":\\"'+edit_control_addr+'\\",\\"on\\":\\"'+edit_on+'\\",\\"off\\":\\"'+edit_off+'\\",\\"stop\\":\\"'+edit_stop+'\\",\\"batch_on\\":\\"'+edit_batch_on+'\\",\\"batch_off\\":\\"'+edit_batch_off+'\\",\\"batch_stop\\":\\"'+edit_batch_stop+'\\",\\"on_cur_key\\":\\"'+edit_on_cur_key+'\\",\\"max_on_cur_key\\":\\"'+edit_max_on_cur_key+'\\",\\"off_cur_key\\":\\"'+edit_off_cur_key+'\\",\\"max_off_cur_key\\":\\"'+edit_max_off_cur_key+'\\"}}"}';
        this.addDeviceAttr(str);
      }

    }
    // this.doEditDeviceAttr(edit_deviceAttr);
  }

  doEditDeviceAttr(deviceAttr:DeviceAttr):Promise<any>{
    let category = deviceAttr.category;
    let str = {};
    if(category == "sensor"){
      let deviceAttrConfig = new DeviceAttrConfig();
      let deviceAttrConfigTrans = new DeviceAttrConfigTrans();
      deviceAttrConfig = deviceAttr.config;
      deviceAttrConfigTrans = deviceAttrConfig.trans;
      let trans = false;
      trans = (deviceAttrConfigTrans.inLow !=0 && deviceAttrConfigTrans.outLow !=0
        && deviceAttrConfigTrans.inHig !=0 && deviceAttrConfigTrans.outHig !=0);
      if(trans){
        str = '{\"'+deviceAttr.key+'\":"{\\"name\\":\\"'+deviceAttr.name+'\\",\\"region\\":\\"'+deviceAttr.region+'\\",\\"category\\":\\"sensor\\",\\"config\\":{\\"type\\":\\"'+deviceAttrConfig.type+'\\",\\"unit\\":\\"'+deviceAttrConfig.unit+'\\",\\"trans\\":['+deviceAttrConfigTrans.inLow+','+deviceAttrConfigTrans.inHig+','+deviceAttrConfigTrans.outLow+','+deviceAttrConfigTrans.outHig+']}}"}';
      }else{
        str = '{\"'+deviceAttr.key+'\":"{\\"name\\":\\"'+deviceAttr.name+'\\",\\"region\\":\\"'+deviceAttr.region+'\\",\\"category\\":\\"sensor\\",\\"config\\":{\\"type\\":\\"'+deviceAttrConfig.type+'\\",\\"unit\\":\\"'+deviceAttrConfig.unit+'\\"}}"}';
      }
    }

    // let deviceid="a7f4a0c0-2e5e-11e7-8375-673c572a5db7";
    return this.http.post(`${environment.serverUrl}/plugins/telemetry/DEVICE/`+this.cur_device_id+`/SERVER_SCOPE`, JSON.parse(JSON.stringify(str)),this.httpOption).toPromise()
      .then(response => {
        if (response.status == 200) {
          // this.device_add = false;
        }
        else {
           Promise.reject("修改失败!");
        }
      })
      .catch(this.handleHttpError);
  }

  addDevice(): Promise<any>{
    let str = {};
    let _deviceAttr = new DeviceAttr();
    if(this.base_add){
        str = '{\"'+this._key+'\":"{\\"name\\":\\"'+this._name+'\\",\\"region\\":\\"'+this._region+'\\",\\"category\\":\\"sensor\\",\\"config\\":{\\"type\\":\\"'+this._category+'\\",\\"unit\\":\\"'+this._wdunit+'\\"}}"}';
    }else if(this.two_state_add){

    }else if(this.three_state_add){

    }else{
      return null;
    }

    // let deviceid="a7f4a0c0-2e5e-11e7-8375-673c572a5db7";
    return this.http.post(`${environment.serverUrl}plugins/telemetry/DEVICE/`+this.cur_device_id+`/SERVER_SCOPE`, JSON.parse(JSON.stringify(str)),this.httpOption).toPromise()
      .then(response => {
        if (response.status == 200) {
          this.device_add = false;
        }
        else {
           Promise.reject("添加失败!");
        }
      })
      .catch(this.handleHttpError)
  }
  

  doAddDevice(domElement: HTMLInputElement):void{
    
    let _key = domElement["_key"].value;
    let _name = domElement["_name"].value;
    let _region = domElement["_region"].value;
    let dAttr = new DeviceAttr();
    dAttr.key = _key;
    dAttr.name = _name;
    dAttr.region = _region;

    if(this.base_add){
      let str = {};
    let _category = domElement["_category"].value;
    let _wdunit = domElement["_wdunit"].value;


      let trans = new DeviceAttrConfigTrans();
      let _2A1inLow = domElement["_1A1inLow"].value;
      let _2A1inHig = domElement["_1A1inHig"].value;
      let _2A1outLow = domElement["_1A1outLow"].value;
      let _2A1outHig = domElement["_1A1outHig"].value;
      trans.inLow = _2A1inLow;
      trans.inHig = _2A1inHig;
      trans.outLow = _2A1outLow;
      trans.outHig = _2A1outHig;

      let cur_key_trans = (trans.inLow !=0 && trans.outLow !=0
        && trans.inHig !=0 && trans.outHig !=0);
      if(cur_key_trans){
        str = '{\"'+dAttr.key+'\":"{\\"name\\":\\"'+dAttr.name+'\\",\\"region\\":\\"'+dAttr.region+'\\",\\"category\\":\\"sensor\\",\\"config\\":{\\"type\\":\\"'+_category+'\\",\\"unit\\":\\"'+_wdunit+'\\",\\"trans\\":['+trans.inLow+','+trans.inHig+','+trans.outLow+','+trans.outHig+']}}"}';
      }else{
        str = '{\"'+dAttr.key+'\":"{\\"name\\":\\"'+dAttr.name+'\\",\\"region\\":\\"'+dAttr.region+'\\",\\"category\\":\\"sensor\\",\\"config\\":{\\"type\\":\\"'+_category+'\\",\\"unit\\":\\"'+_wdunit+'\\"}}"}';
      }
      // str = '{\"'+dAttr.key+'\":"{\\"name\\":\\"'+dAttr.name+'\\",\\"region\\":\\"'+dAttr.region+'\\",\\"category\\":\\"sensor\\",\\"config\\":{\\"type\\":\\"'+_category+'\\",\\"unit\\":\\"'+_wdunit+'\\"}}"}';
        //  str = '{\"'+dAttr.key+'\":"{\\"name\\":\\"'+dAttr.name+'\\",\\"region\\":\\"'+dAttr.region+'\\",\\"category\\":\\"sensor\\",\\"config\\":{\\"type\\":\\"'+_category+'\\",\\"unit\\":\\"'+_wdunit+'\\"}}"}';
      
         this.addDeviceAttr(str);
    }

    if(this.two_state_add){
      //两态可控
      //controller
      dAttr.category = "controller";
      let twoStateConfig = new TwoStateConfig();
      let control_addr = domElement["control_addr"].value;
      let _on = domElement["_on"].value;
      let _stop = domElement["_stop"].value;
      let _batch_on = domElement["_batch_on"].value;
      let _batch_stop = domElement["_batch_stop"].value;
      let _cur_key = domElement["_cur_key"].value;
      let _max_cur_key = domElement["_max_cur_key"].value;
      twoStateConfig.type = "两态可控";
      twoStateConfig.control_addr = control_addr;
      twoStateConfig.on = _on;
      twoStateConfig.stop = _stop;
      twoStateConfig.batch_on = _batch_on;
      twoStateConfig.batch_stop = _batch_stop;
      twoStateConfig.cur_key = _cur_key;
      twoStateConfig.max_cur_key = _max_cur_key;

      let c_str = {};
      c_str = '{\"'+dAttr.key+'\":"{\\"name\\":\\"'+dAttr.name+'\\",\\"region\\":\\"'+dAttr.region+'\\",\\"category\\":\\"controller\\",\\"config\\":{\\"type\\":\\"'+twoStateConfig.type+'\\",\\"control_addr\\":\\"'+twoStateConfig.control_addr+'\\",\\"on\\":\\"'+twoStateConfig.on+'\\",\\"stop\\":\\"'+twoStateConfig.stop+'\\",\\"batch_on\\":\\"'+twoStateConfig.batch_on+'\\",\\"batch_stop\\":\\"'+twoStateConfig.batch_stop+'\\",\\"cur_key\\":\\"'+twoStateConfig.cur_key+'\\",\\"max_cur_key\\":\\"'+twoStateConfig.max_cur_key+'\\"}}"}';

      this.addDeviceAttr(c_str);

      //cur_key
      let cur_key_A = new Amperemeter();
      let _2A1name = domElement["_2A1name"].value;
      let _2A1key = domElement["_2A1key"].value;
      let _2A1region = domElement["_2A1region"].value;
      let _2A1category = domElement["_2A1category"].value;
      cur_key_A.key = _2A1key;
      cur_key_A.name = _2A1name;
      cur_key_A.region = _2A1region;
      cur_key_A.category = _2A1category;
      //电流config
      let cur_key_A_c = new AmperemeterConfig();
      let _2A1ref_item = domElement["_2A1ref_item"].value;
      let _2A1ref_key = domElement["_2A1ref_key"].value;
      let _2A1unit = domElement["_2A1unit"].value;
      cur_key_A_c.ref_item = _2A1ref_item;
      cur_key_A_c.ref_key = _2A1ref_key;
      cur_key_A_c.unit = _2A1unit;
      //值转换
      let trans = new DeviceAttrConfigTrans();
      let _2A1inLow = domElement["_2A1inLow"].value;
      let _2A1inHig = domElement["_2A1inHig"].value;
      let _2A1outLow = domElement["_2A1outLow"].value;
      let _2A1outHig = domElement["_2A1outHig"].value;
      trans.inLow = _2A1inLow;
      trans.inHig = _2A1inHig;
      trans.outLow = _2A1outLow;
      trans.outHig = _2A1outHig;
      cur_key_A_c.trans = trans;
      cur_key_A.config = cur_key_A_c;

      let c_a_str = {};

      let cur_key_trans = (trans.inLow !=0 && trans.outLow !=0
        && trans.inHig !=0 && trans.outHig !=0);
      if(cur_key_trans){
        c_a_str = '{\"'+cur_key_A.key+'\":"{\\"name\\":\\"'+cur_key_A.name+'\\",\\"region\\":\\"'+cur_key_A.region+'\\",\\"category\\":\\"'+cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+cur_key_A_c.unit+'\\",\\"trans\\":['+trans.inLow+','+trans.inHig+','+trans.outLow+','+trans.outHig+']}}"}';
      }else{
        c_a_str = '{\"'+cur_key_A.key+'\":"{\\"name\\":\\"'+cur_key_A.name+'\\",\\"region\\":\\"'+cur_key_A.region+'\\",\\"category\\":\\"'+cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+cur_key_A_c.unit+'\\"}}"}';
      }
      this.addDeviceAttr(c_a_str);

      //max_cur_key
      let max_cur_key_A = new Amperemeter();
      let _2A2name = domElement["_2A2name"].value;
      let _2A2key = domElement["_2A2key"].value;
      let _2A2region = domElement["_2A2region"].value;
      let _2A2category = domElement["_2A2category"].value;
      max_cur_key_A.key = _2A2key;
      max_cur_key_A.name = _2A2name;
      max_cur_key_A.region = _2A2region;
      max_cur_key_A.category = _2A2category;
      //电流config
      let max_cur_key_A_c = new AmperemeterConfig();
      let _2A2ref_item = domElement["_2A2ref_item"].value;
      let _2A2ref_key = domElement["_2A2ref_key"].value;
      let _2A2unit = domElement["_2A2unit"].value;
      max_cur_key_A_c.ref_item = _2A2ref_item;
      max_cur_key_A_c.ref_key = _2A2ref_key;
      max_cur_key_A_c.unit = _2A2unit;
      //值转换
      let trans2 = new DeviceAttrConfigTrans();
      let _2A2inLow = domElement["_2A2inLow"].value;
      let _2A2inHig = domElement["_2A2inHig"].value;
      let _2A2outLow = domElement["_2A2outLow"].value;
      let _2A2outHig = domElement["_2A2outHig"].value;
      trans2.inLow = _2A2inLow;
      trans2.inHig = _2A2inHig;
      trans2.outLow = _2A2outLow;
      trans2.outHig = _2A2outHig;
      max_cur_key_A_c.trans = trans2;
      max_cur_key_A.config = max_cur_key_A_c;

      let max_cur_key_trans = (trans2.inLow !=0 && trans2.outLow !=0
        && trans2.inHig !=0 && trans2.outHig !=0);
      if(max_cur_key_trans){
        c_a_str = '{\"'+max_cur_key_A.key+'\":"{\\"name\\":\\"'+max_cur_key_A.name+'\\",\\"region\\":\\"'+max_cur_key_A.region+'\\",\\"category\\":\\"'+max_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+max_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+max_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+max_cur_key_A_c.unit+'\\",\\"trans\\":['+trans2.inLow+','+trans2.inHig+','+trans2.outLow+','+trans2.outHig+']}}"}';
      }else{
        c_a_str = '{\"'+max_cur_key_A.key+'\":"{\\"name\\":\\"'+max_cur_key_A.name+'\\",\\"region\\":\\"'+max_cur_key_A.region+'\\",\\"category\\":\\"'+max_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+max_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+max_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+max_cur_key_A_c.unit+'\\"}}"}';
      }
      this.addDeviceAttr(c_a_str);

    }

    if(this.three_state_add){

      //三态可控
      //controller
      dAttr.category = "controller";
      let threeStateConfig = new ThreeStateConfig();
      let control_addr = domElement["_3control_addr"].value;
      let _on = domElement["_3on"].value;
      let _off = domElement["_3off"].value;
      let _stop = domElement["_3stop"].value;
      let _batch_on = domElement["_3batch_on"].value;
      let _batch_off = domElement["_3batch_off"].value;
      let _batch_stop = domElement["_3batch_stop"].value;
      let _on_cur_key = domElement["_3on_cur_key"].value;
      let _max_on_cur_key = domElement["_3max_on_cur_key"].value;
      let _off_cur_key = domElement["_3off_cur_key"].value;
      let _max_off_cur_key = domElement["_3max_off_cur_key"].value;
      threeStateConfig.type = "三态可控";
      threeStateConfig.control_addr = control_addr;
      threeStateConfig.on = _on;
      threeStateConfig.off = _off;
      threeStateConfig.stop = _stop;
      threeStateConfig.batch_on = _batch_on;
      threeStateConfig.batch_off = _batch_off;
      threeStateConfig.batch_stop = _batch_stop;
      threeStateConfig.on_cur_key = _on_cur_key;
      threeStateConfig.max_on_cur_key = _max_on_cur_key;
      threeStateConfig.off_cur_key = _off_cur_key;
      threeStateConfig.max_off_cur_key = _max_off_cur_key;

      let c_str = {};
      c_str = '{\"'+dAttr.key+'\":"{\\"name\\":\\"'+dAttr.name+'\\",\\"region\\":\\"'+dAttr.region+'\\",\\"category\\":\\"controller\\",\\"config\\":{\\"type\\":\\"'+threeStateConfig.type+'\\",\\"control_addr\\":\\"'+threeStateConfig.control_addr+'\\",\\"on\\":\\"'+threeStateConfig.on+'\\",\\"off\\":\\"'+threeStateConfig.off+'\\",\\"stop\\":\\"'+threeStateConfig.stop+'\\",\\"batch_on\\":\\"'+threeStateConfig.batch_on+'\\",\\"batch_off\\":\\"'+threeStateConfig.batch_off+'\\",\\"batch_stop\\":\\"'+threeStateConfig.batch_stop+'\\",\\"on_cur_key\\":\\"'+threeStateConfig.on_cur_key+'\\",\\"max_on_cur_key\\":\\"'+threeStateConfig.max_on_cur_key+'\\",\\"off_cur_key\\":\\"'+threeStateConfig.off_cur_key+'\\",\\"max_off_cur_key\\":\\"'+threeStateConfig.max_off_cur_key+'\\"}}"}';

      this.addDeviceAttr(c_str);

      //on_cur_key
      let on_cur_key_A = new Amperemeter();
      let _3Aonkey = domElement["_3Aonkey"].value;
      let _3Aonname = domElement["_3Aonname"].value;
      let _3Aonregion = domElement["_3Aonregion"].value;
      let _3Aoncategory = domElement["_3Aoncategory"].value;
      on_cur_key_A.key = _3Aonkey;
      on_cur_key_A.name = _3Aonname;
      on_cur_key_A.region = _3Aonregion;
      on_cur_key_A.category = _3Aoncategory;
      //电流config
      let on_cur_key_A_c = new AmperemeterConfig();
      let _3Aonref_item = domElement["_3Aonref_item"].value;
      let _3Aonref_key = domElement["_3Aonref_key"].value;
      let _3Aonunit = domElement["_3Aonunit"].value;
      on_cur_key_A_c.ref_item = _3Aonref_item;
      on_cur_key_A_c.ref_key = _3Aonref_key;
      on_cur_key_A_c.unit = _3Aonunit;
      //值转换
      let on_trans = new DeviceAttrConfigTrans();
      let _3AoninLow = domElement["_3AoninLow"].value;
      let _3AoninHig = domElement["_3AoninHig"].value;
      let _3AonoutLow = domElement["_3AonoutLow"].value;
      let _3AonoutHig = domElement["_3AonoutHig"].value;
      on_trans.inLow = _3AoninLow;
      on_trans.inHig = _3AoninHig;
      on_trans.outLow = _3AonoutLow;
      on_trans.outHig = _3AonoutHig;
      on_cur_key_A_c.trans = on_trans;
      on_cur_key_A.config = on_cur_key_A_c;

      let on_c_a_str = {};
      let on_cur_key_trans = (on_trans.inLow !=0 && on_trans.outLow !=0
        && on_trans.inHig !=0 && on_trans.outHig !=0);
      if(on_cur_key_trans){
        on_c_a_str = '{\"'+on_cur_key_A.key+'\":"{\\"name\\":\\"'+on_cur_key_A.name+'\\",\\"region\\":\\"'+on_cur_key_A.region+'\\",\\"category\\":\\"'+on_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+on_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+on_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+on_cur_key_A_c.unit+'\\",\\"trans\\":['+on_trans.inLow+','+on_trans.inHig+','+on_trans.outLow+','+on_trans.outHig+']}}"}';
      }else{
        on_c_a_str = '{\"'+on_cur_key_A.key+'\":"{\\"name\\":\\"'+on_cur_key_A.name+'\\",\\"region\\":\\"'+on_cur_key_A.region+'\\",\\"category\\":\\"'+on_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+on_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+on_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+on_cur_key_A_c.unit+'\\"}}"}';
      }
      this.addDeviceAttr(on_c_a_str);

      //max_on_cur_key
      let max_on_cur_key_A = new Amperemeter();
      let _3Amaxonname = domElement["_3Amaxonname"].value;
      let _3Amaxonkey = domElement["_3Amaxonkey"].value;
      let _3Amaxonregion = domElement["_3Amaxonregion"].value;
      let _3Amaxoncategory = domElement["_3Amaxoncategory"].value;
      max_on_cur_key_A.key = _3Amaxonkey;
      max_on_cur_key_A.name = _3Amaxonname;
      max_on_cur_key_A.region = _3Amaxonregion;
      max_on_cur_key_A.category = _3Amaxoncategory;
      //电流config
      let max_on_cur_key_A_c = new AmperemeterConfig();
      let _3Amaxonref_item = domElement["_3Amaxonref_item"].value;
      let _3Amaxonref_key = domElement["_3Amaxonref_key"].value;
      let _3Amaxonunit = domElement["_3Amaxonunit"].value;
      max_on_cur_key_A_c.ref_item = _3Amaxonref_item;
      max_on_cur_key_A_c.ref_key = _3Amaxonref_key;
      max_on_cur_key_A_c.unit = _3Amaxonunit;
      //值转换
      let max_on_trans2 = new DeviceAttrConfigTrans();
      let _3AmaxoninLow = domElement["_3AmaxoninLow"].value;
      let _3AmaxoninHig = domElement["_3AmaxoninHig"].value;
      let _3AmaxonoutLow = domElement["_3AmaxonoutLow"].value;
      let _3AmaxonoutHig = domElement["_3AmaxonoutHig"].value;
      max_on_trans2.inLow = _3AmaxoninLow;
      max_on_trans2.inHig = _3AmaxoninHig;
      max_on_trans2.outLow = _3AmaxonoutLow;
      max_on_trans2.outHig = _3AmaxonoutHig;
      max_on_cur_key_A_c.trans = max_on_trans2;
      max_on_cur_key_A.config = max_on_cur_key_A_c;

      let max_cur_key_trans = (max_on_trans2.inLow !=0 && max_on_trans2.outLow !=0
        && max_on_trans2.inHig !=0 && max_on_trans2.outHig !=0);
      let max_on_c_a_str = {};
      if(max_cur_key_trans){
        max_on_c_a_str = '{\"'+max_on_cur_key_A.key+'\":"{\\"name\\":\\"'+max_on_cur_key_A.name+'\\",\\"region\\":\\"'+max_on_cur_key_A.region+'\\",\\"category\\":\\"'+max_on_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+max_on_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+max_on_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+max_on_cur_key_A_c.unit+'\\",\\"trans\\":['+max_on_trans2.inLow+','+max_on_trans2.inHig+','+max_on_trans2.outLow+','+max_on_trans2.outHig+']}}"}';
      }else{
        max_on_c_a_str = '{\"'+max_on_cur_key_A.key+'\":"{\\"name\\":\\"'+max_on_cur_key_A.name+'\\",\\"region\\":\\"'+max_on_cur_key_A.region+'\\",\\"category\\":\\"'+max_on_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+max_on_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+max_on_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+max_on_cur_key_A_c.unit+'\\"}}"}';
      }
      this.addDeviceAttr(max_on_c_a_str);

      //off_cur_key
      let off_cur_key_A = new Amperemeter();
      let _3Aoffkey = domElement["_3Aoffkey"].value;
      let _3Aoffname = domElement["_3Aoffname"].value;
      let _3Aoffregion = domElement["_3Aoffregion"].value;
      let _3Aoffcategory = domElement["_3Aoffcategory"].value;
      off_cur_key_A.key = _3Aoffkey;
      off_cur_key_A.name = _3Aoffname;
      off_cur_key_A.region = _3Aoffregion;
      off_cur_key_A.category = _3Aoffcategory;
      //电流config
      let off_cur_key_A_c = new AmperemeterConfig();
      let _3Aoffref_item = domElement["_3Aoffref_item"].value;
      let _3Aoffref_key = domElement["_3Aoffref_key"].value;
      let _3Aoffunit = domElement["_3Aoffunit"].value;
      off_cur_key_A_c.ref_item = _3Aoffref_item;
      off_cur_key_A_c.ref_key = _3Aoffref_key;
      off_cur_key_A_c.unit = _3Aoffunit;
      //值转换
      let off_trans = new DeviceAttrConfigTrans();
      let _3AoffinLow = domElement["_3AoffinLow"].value;
      let _3AoffinHig = domElement["_3AoffinHig"].value;
      let _3AoffoutLow = domElement["_3AoffoutLow"].value;
      let _3AoffoutHig = domElement["_3AoffoutHig"].value;
      off_trans.inLow = _3AoffinLow;
      off_trans.inHig = _3AoffinHig;
      off_trans.outLow = _3AoffoutLow;
      off_trans.outHig = _3AoffinLow;
      off_cur_key_A_c.trans = off_trans;
      off_cur_key_A.config = off_cur_key_A_c;

      let off_c_a_str = {};
      let off_cur_key_trans = (off_trans.inLow !=0 && off_trans.outLow !=0
        && off_trans.inHig !=0 && off_trans.outHig !=0);
      if(off_cur_key_trans){
        off_c_a_str = '{\"'+off_cur_key_A.key+'\":"{\\"name\\":\\"'+off_cur_key_A.name+'\\",\\"region\\":\\"'+off_cur_key_A.region+'\\",\\"category\\":\\"'+off_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+off_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+off_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+off_cur_key_A_c.unit+'\\",\\"trans\\":['+off_trans.inLow+','+off_trans.inHig+','+off_trans.outLow+','+off_trans.outHig+']}}"}';
      }else{
        off_c_a_str = '{\"'+off_cur_key_A.key+'\":"{\\"name\\":\\"'+off_cur_key_A.name+'\\",\\"region\\":\\"'+off_cur_key_A.region+'\\",\\"category\\":\\"'+off_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+off_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+off_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+off_cur_key_A_c.unit+'\\"}}"}';
      }
      this.addDeviceAttr(off_c_a_str);

      //max_off_cur_key
      let max_off_cur_key_A = new Amperemeter();
      let _3Amaxoffkey = domElement["_3Amaxoffkey"].value;
      let _3Amaxoffname = domElement["_3Amaxoffname"].value;
      let _3Amaxoffregion = domElement["_3Amaxoffregion"].value;
      let _3Amaxoffcategory = domElement["_3Amaxoffcategory"].value;
      max_off_cur_key_A.key = _3Amaxoffkey;
      max_off_cur_key_A.name = _3Amaxoffname;
      max_off_cur_key_A.region = _3Amaxoffregion;
      max_off_cur_key_A.category = _3Amaxoffcategory;
      //电流config
      let max_off_cur_key_A_c = new AmperemeterConfig();
      let _3Amaxoffref_item = domElement["_3Amaxoffref_item"].value;
      let _3Amaxoffref_key = domElement["_3Amaxoffref_key"].value;
      let _3Amaxoffunit = domElement["_3Amaxoffunit"].value;
      max_off_cur_key_A_c.ref_item = _3Amaxoffref_item;
      max_off_cur_key_A_c.ref_key = _3Amaxoffref_key;
      max_off_cur_key_A_c.unit = _3Amaxoffunit;
      //值转换
      let max_off_trans2 = new DeviceAttrConfigTrans();
      let _3AmaxoffinLow = domElement["_3AmaxoffinLow"].value;
      let _3AmaxoffinHig = domElement["_3AmaxoffinHig"].value;
      let _3AmaxoffoutLow = domElement["_3AmaxoffoutLow"].value;
      let _3AmaxoffoutHig = domElement["_3AmaxoffoutHig"].value;
      max_off_trans2.inLow = _3AmaxoffinLow;
      max_off_trans2.inHig = _3AmaxoffinHig;
      max_off_trans2.outLow = _3AmaxoffoutLow;
      max_off_trans2.outHig = _3AmaxoffoutHig;
      max_off_cur_key_A_c.trans = max_off_trans2;
      max_off_cur_key_A.config = max_off_cur_key_A_c;

      let max_off_cur_key_trans = (max_off_trans2.inLow !=0 && max_off_trans2.outLow !=0
        && max_off_trans2.inHig !=0 && max_off_trans2.outHig !=0);
      let max_off_c_a_str = {};
      if(max_off_cur_key_trans){
        max_off_c_a_str = '{\"'+max_off_cur_key_A.key+'\":"{\\"name\\":\\"'+max_off_cur_key_A.name+'\\",\\"region\\":\\"'+max_off_cur_key_A.region+'\\",\\"category\\":\\"'+max_off_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+max_off_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+max_off_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+max_off_cur_key_A_c.unit+'\\",\\"trans\\":['+max_off_trans2.inLow+','+max_off_trans2.inHig+','+max_off_trans2.outLow+','+max_off_trans2.outHig+']}}"}';
      }else{
        max_off_c_a_str = '{\"'+max_off_cur_key_A.key+'\":"{\\"name\\":\\"'+max_off_cur_key_A.name+'\\",\\"region\\":\\"'+max_off_cur_key_A.region+'\\",\\"category\\":\\"'+max_off_cur_key_A.category+'\\",\\"config\\":{\\"ref_item\\":\\"'+max_off_cur_key_A_c.ref_item+'\\",\\"ref_key\\":\\"'+max_off_cur_key_A_c.ref_key+'\\",\\"unit\\":\\"'+max_off_cur_key_A_c.unit+'\\"}}"}';
      }
      this.addDeviceAttr(max_off_c_a_str);

    }
    
  }

  public retstr:string = "";

  addDeviceAttr(str:{}): Promise<any>{
    // this.cur_device_id ="a7f4a0c0-2e5e-11e7-8375-673c572a5db7";
    return this.http.post(`${environment.serverUrl}/plugins/telemetry/DEVICE/`+this.cur_device_id+`/SERVER_SCOPE`, JSON.parse(JSON.stringify(str)),this.httpOption).toPromise()
      .then(response => {
        if (response.status == 200) {
          this.undo();
        }
        else {
           Promise.reject("添加失败!");
        }
      })
      .catch(this.handleHttpError)
  }

  undo():void{

    this.retstr = "操作成功!";
          setTimeout(() => {
		        this.retstr = "";
        }, 2000);
              
    this.deviceAttrList = [];
    this.getDeviceAttrList(this.cur_device_id);
    this.dkey = "";
    this.ukey = "";
    this.imgkey = "";
    this.device_add = false;
  }
  

  goAddDevice():void{
    this.device_add = true;
  }
  canelDddDevice():void{
    this.dkey = "";
    this.ukey = "";
    this.imgkey = "";
    this.device_add = false;
  }

  activePanel(id:string):void{
    this.getDeviceAttrList(id);
  }


  public devices: Array<Device> = [];
  getUserDevices(): void {
     this.http.get(`${environment.serverUrl}/customer/`+localStorage.getItem("userid")+`/devices?limit=50`,this.httpOption)
    .toPromise().then(response => {
        let data = response.json().data;
               
        for(let tmp in data){
          if(tmp=="0"){
            this._currentActiveName = data[tmp].name;
            this.getDeviceAttrList(data[tmp].id.id);
            this.cur_device_id = data[tmp].id.id;
          }
          let _device = new Device(data[tmp].name,data[tmp].id.id);
          this.devices.push(_device);
        }
      });
  }

  isActive(name: string): string {
    if (name == this._currentActiveName)
      return "on";
    else
      return "";
  }

  activeClk(name:string,id:string):void{
    this.chkkey = [];
      this._currentActiveName = name;
      this.cur_device_id = id;
      this.getDeviceAttrList(id);
  }

  orderLayout():void{

  }

  ngOnInit() {
  }

}

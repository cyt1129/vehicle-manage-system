import { Component, OnInit } from '@angular/core';
import {NgModule} from "@angular/core";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Subject} from "rxjs/Subject";
import {Device} from '../model/device';
import {environment} from "../../../../environments/environment";
//import { NgFor } from '@angular/common';
import {DeviceAttrListComponent} from "../attrlist-panel/device-attr-list.component";

@Component({
  selector: 'devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['../cfg.component.css']
})
export class DevicesComponent implements OnInit {

  private httpOption: RequestOptions;
  public devices: Array<Device> = [];
  private _currentActiveName = "";
  constructor(
    private http: Http,
    private deviceAttrListComponent:DeviceAttrListComponent) { 

    let token = localStorage.getItem("token");
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer ' + token
    });
    this.httpOption = new RequestOptions({
      headers: headers
    });

    this.getUserDevices();
  }

  getUserDevices(): void {
     this.http.get(`${environment.serverUrl}/customer/`+localStorage.getItem("userid")+`/devices?limit=50`,this.httpOption)
    .toPromise().then(response => {
        let data = response.json().data;
               
        for(let tmp in data){
          if(tmp=="0"){
            this._currentActiveName = data[tmp].name;
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
      this._currentActiveName = name;
      this.deviceAttrListComponent.cur_device_id = id;
      this.deviceAttrListComponent.activePanel(id);
  }

  ngOnInit() {
  }

}

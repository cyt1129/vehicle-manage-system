import { Component, OnInit } from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import {Subject} from "rxjs/Subject";
import {Device} from './model/device';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-cfg',
  templateUrl: './cfg.component.html',
  styleUrls: ['./cfg.component.css']
})
export class CfgComponent implements OnInit {

  private httpOption: RequestOptions;
  constructor(private http: Http) { 

    let token = localStorage.getItem("token");
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Authorization': 'Bearer ' + token
    });
    this.httpOption = new RequestOptions({
      headers: headers
    });

    this.getUserDevices();
    this.deviceRegister = true;
    this.deviceTypeAdd =false;

  }

  private deviceRegister:boolean
  private deviceTypeAdd:boolean

  getUserDevices(): Subject<Device> {
     this.http.get(`${environment.serverUrl}/customer/`+localStorage.getItem("userid")+`/devices?limit=50`,this.httpOption)
    .toPromise().then(response => {
        let devices = response.json().data;
        for(let tmp in devices){
          // console.log(devices[tmp].name);
        }
      });
    return null;
  }


  setFormType(value:string){
    if(value == "auth"){
      this.deviceRegister = true;
      this.deviceTypeAdd = false;
    }else{
      this.deviceRegister = false;
      this.deviceTypeAdd = true;
    }
  }

  isActive(value:string){
    switch(value){
      case "auth":
         return this.deviceRegister?"on":"off";
      default:
         return this.deviceTypeAdd?"on":"off";
    }


  }

  ngOnInit() {
  }

}

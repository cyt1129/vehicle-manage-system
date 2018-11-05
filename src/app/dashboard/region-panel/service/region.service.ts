import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {Observable} from "rxjs/Observable";
import {Region} from "../../model/region";
import {Subject} from "rxjs/Subject";
import {WebsocketService} from "../../websocket.service";
import {UserService} from "../../../user/login/service/user.service";
import {isNullOrUndefined} from "util";
import {Subregion} from "../../model/subregion";
import {Sensor} from "../../model/sensor";

@Injectable()
export class RegionService {
  public mockRegionUrl = "assets/mock-data/region-mock.json";

  regionList: Region[] = [];

  constructor(private _http: Http,
              private _userService: UserService,
              private _websocket: WebsocketService) {
  }

  // this is mock data for test, data retrieved from websocket needs to be transformed like this.
  // push region[] to component.
  getRegionData(): Observable<any> {
    return this._http.get(this.mockRegionUrl)
      .map(response => {
        let json = response.json();
        //console.info(json);
        return json;
      });
  }

  getRegionDataFromWs(): Subject<Region[]> {
    let subject = new Subject<Region[]>();

    let ob = new Observable<Region[]>();


    this._userService.getUserInfo()
      .filter((message) => {
        //console.log(message);
        return message.name == "deviceList";
        
      })
      .map(message => message.data)
      .subscribe(deviceIds => { //userIds就是deviceIds,这里写的有问题
        this._websocket.getRegionDataByDeviceIds(deviceIds);//设定webSocketSubject的subject
        this._websocket.attrSubject//ws连接后会执行handleAttrMsgSubscription()，填上attrSubject
          .filter(msg => msg.name == "sensorCfg")
          .map(msg => msg.data)
          .subscribe(sensorCfgStr => {
            this.regionListGenerator(sensorCfgStr);
          });

        subject.next(this.regionList);
      });
    return subject;
  }

  private regionListGenerator(sensorCfg: any): void {
    let entityId = sensorCfg.entityId;
    let regionStr = sensorCfg.region;
    let tmp = regionStr.split("|");
    let regionName = tmp[0];
    let subregionname = tmp[1];

    let pos = this.indexOfRegion(this.regionList, regionName);

    if (pos > -1) {
      // append region
      if (!isNullOrUndefined(subregionname)) {
        let subregionList = this.regionList[pos].subRegions;
        let subpos = this.indexOfSubregion(subregionList, subregionname);
        if(subpos > -1){
          // append subregion
          let subregion = subregionList[subpos];
          if(subregion.entityIds.indexOf(entityId) < 0) {
            // add deviceId into this subregion.
            subregion.entityIds.push(entityId);
          }
          subregion.sensors.push(new Sensor(sensorCfg));
          //subregionList[subpos].deviceIds.push(deviceId);

        }else{
          // add subregion
          let subregion = new Subregion();
          subregion.subregionName = subregionname;
          subregion.entityIds.push(entityId);
          subregion.sensors.push(new Sensor(sensorCfg));
          subregionList.push(subregion);
        }
      }
    } else {
      // add region
      if (!isNullOrUndefined(regionName)) {
        let region = new Region();
        region.regionName = regionName;
        if (!isNullOrUndefined(subregionname)) {
          let subregion = new Subregion();
          subregion.subregionName = subregionname;
          subregion.entityIds.push(entityId);
          subregion.sensors.push(new Sensor(sensorCfg));

          region.subRegions.push(subregion);
        }
        this.regionList.push(region);
      }
    }
  }

  private sensorGenatator(sensorCfg: any): void {
    let sensor = new Sensor(sensorCfg);
  }

  private indexOfRegion(regionList: Region[], regionName: string): number {
    for (let i = 0; i < regionList.length; i++) {
      let tmp = regionList[i];
      if (tmp.regionName == regionName)
        return i;
    }
    return -1;
  }

  private indexOfSubregion(subregionList: Subregion[], subregionName: string): number {
    for (let i = 0; i < subregionList.length; i++) {
      let tmp = subregionList[i];
      if (tmp.subregionName == subregionName)
        return i;
    }
    return -1;
  }
}

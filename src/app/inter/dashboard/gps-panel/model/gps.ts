import { Point } from "angular2-baidu-map";
import { ParentInfo } from "../../model/sensor";
import { Marker } from "./marker";

export class GPS {
    //entityId:string;
    name: string;
    //region:string;//看一下sensor
    category:string;
    key:string;  
    data:string;//测试加的
    time:string;//测试加的
    point?:Point
    marker:Marker

    parentInfo: ParentInfo = new ParentInfo();
    constructor(){}
  }

  
  
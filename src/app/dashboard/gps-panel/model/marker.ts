import { Point, MarkerOptions } from "angular2-baidu-map";
import { ParentInfo } from "../../model/sensor";

export class Marker {
    point:Point; 
    //entityId?:string;
    title?:string;  
    time:number;
    options?:MarkerOptions;
    parentInfo?:ParentInfo;
    direction:string;
    speed:string;
    constructor(){}
  }
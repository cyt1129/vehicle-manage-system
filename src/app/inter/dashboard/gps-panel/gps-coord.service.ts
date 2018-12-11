import { Injectable } from '@angular/core';
import { Point} from 'angular2-baidu-map';
import { Marker } from './model/marker';
import { GPS } from './model/gps';

@Injectable()
export class GpsCoordService {

  constructor() { }

  pi = Math.PI;  
  private a = 6378245.0;  
  private ee = 0.00669342162296594323;

  transformLat(x:number, y:number):number{
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y  + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;  
    ret += (20.0 * Math.sin(y * this.pi) + 40.0 * Math.sin(y / 3.0 * this.pi)) * 2.0 / 3.0;  
    ret += (160.0 * Math.sin(y / 12.0 * this.pi) + 320 * Math.sin(y * this.pi / 30.0)) * 2.0 / 3.0;  
    return ret;
  }

  transformLon(x,y):number{
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));  
    ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;  
    ret += (20.0 * Math.sin(x * this.pi) + 40.0 * Math.sin(x / 3.0 * this.pi)) * 2.0 / 3.0;  
    ret += (150.0 * Math.sin(x / 12.0 * this.pi) + 300.0 * Math.sin(x / 30.0 * this.pi)) * 2.0 / 3.0;  
    return ret;
  }  

  /** 
    * 84 to 火星坐标系 (GCJ-02) World Geodetic System ==> Mars Geodetic System 
	*/
  gps84_To_Bd09(lat:number,lon:number):Point {  
	  let dLat = this.transformLat(lon - 105.0, lat - 35.0);  
	  let dLon = this.transformLon(lon - 105.0, lat - 35.0);  
	  let radLat = lat / 180.0 * this.pi;  
	  let magic = Math.sin(radLat);  
	  magic = 1 - this.ee * magic * magic;  
	  let sqrtMagic = Math.sqrt(magic);  
	  dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);  
	  dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);  
	  let mgLat = lat + dLat;  
    let mgLon = lon + dLon; 
    //将 GCJ-02 坐标转换成 BD-09 坐标
    let x = mgLon;
    let y = mgLat; 
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.pi);  
	  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.pi);  
	  let bd_lon = z * Math.cos(theta) + 0.0065;  
	  let bd_lat = z * Math.sin(theta) + 0.006;  
    let p:Point
    p={
        lat:bd_lat,
        lng:bd_lon
      }
    return p;
  }  
    /** 
	 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换算法 将 GCJ-02 坐标转换成 BD-09 坐标 
	 */
	gcj02_To_Bd09(gg_lat, gg_lon) {  
	  var x = gg_lon, y = gg_lat;  
	  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.pi);  
	  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.pi);  
	  var bd_lon = z * Math.cos(theta) + 0.0065;  
	  var bd_lat = z * Math.sin(theta) + 0.006;  
	  console.log(bd_lon+" "+bd_lat);  
  } 
      
  knots_To_km(data:string):string{
    let kn = parseFloat(data);
    let km = kn*1.825
    return km.toFixed(1) + "km/h";
  }

  findDirection(data:string):string{
    let degree = parseFloat(data);
    let d;
    if(degree == 0.0){
      d = "北";
    }else if(degree == 90.0){
      d = "东";
    }else if(degree == 180.0){
      d = "南";
    }else if(degree == 270.0){
      d = "西";
    }else if(degree>0.0 && degree <90.0){
      d = "东北";
    }else if(degree > 90.0 && degree < 180.0){
      d = "东南";
    }else if(degree>180.0 && degree <270.0){
      d = "西南";
    }else d = "西北";
    return d;
  }    

  handleGPSRawdata(data:string):Marker{ 
    /**{
     *    前面加一条判断gps数据是否合法的代码
     * }
     */

    //let data="$GNRMC,070203.000,A,3015.8482,N,12007.0309,E,0.00,0.00,310718,,,A*75";
    //         "$GNRMC,091242.000,A,30158866,N,12007.0416,E,0.00,330.70,191018,,,A*7B↵"
    let m = new Marker();
    let strArray = data.split(",");
    //console.log(strArray);
    let y = parseFloat(strArray[5]);//原始经度
    let x = parseFloat(strArray[3]);//原始纬度
    let y_z = parseInt((y/100).toString());//取经度整数部分
    let x_z = parseInt((x/100).toString());//取维度整数部分
    x = (x-x_z*100)/60+x_z;
    y = (y-y_z*100)/60+y_z;
    let p:Point;
    p = this.gps84_To_Bd09(x,y);
    m.point = p;

    //转换地面速率
    m.speed = this.knots_To_km(strArray[7]);
    //转换方向
    m.direction = this.findDirection(strArray[8]);
    //console.log(p);
    //marker.lat=30;
    return m;
  }

  GPSGenerator(GPSCfg: any): GPS {
    let gpsModel = new GPS();
    //gpsModel.entityId= GPSCfg.entityId;
    //gpsModel.region = GPSCfg.region;
    gpsModel.name = GPSCfg.name;
    gpsModel.category = GPSCfg.category;
    gpsModel.key = GPSCfg.key;
    gpsModel.parentInfo = GPSCfg.parentInfo;
    //this.GPSList[gpsModel.entityId]=gpsModel;
    return gpsModel;
   
  }
  /**
   * 五点平滑算法
   * @param double 
   */
  linearSmooth5 (inP:Array<number>,outP:Array<number>, N:number):void{

    if ( N < 5 ){
        for ( let i = 0; i <= N - 1; i++ ){
            outP[i] = inP[i];
        }
    }
    else{
        outP[0] = ( 3.0 * inP[0] + 2.0 * inP[1] + inP[2] - inP[4] ) / 5.0;
        outP[1] = ( 4.0 * inP[0] + 3.0 * inP[1] + 2 * inP[2] + inP[3] ) / 10.0;
        for ( let i = 2; i <= N - 3; i++ )
        {
            outP[i] = ( inP[i - 2] + inP[i - 1] + inP[i] + inP[i + 1] + inP[i + 2] ) / 5.0;
        }
        outP[N - 2] = ( 4.0 * inP[N - 1] + 3.0 * inP[N - 2] + 2 * inP[N - 3] + inP[N - 4] ) / 10.0;
        outP[N - 1] = ( 3.0 * inP[N - 1] + 2.0 * inP[N - 2] + inP[N - 3] - inP[N - 5] ) / 5.0;
    }
}
/**
 * 五点平滑算法
 * @param m 
 */
smooth5(m:Marker[]):void{
  var l = m.length;
  if(m.length < 5){
    //return m;
  }else{
    m[0].point.lat = (3.0 * m[0].point.lat + 2*m[1].point.lat + m[2].point.lat - m[4].point.lat)/5;
    m[1].point.lat = ( 4 * m[0].point.lat + 3 * m[1].point.lat + 2 * m[2].point.lat + m[3].point.lat)/10;
    for(let i = 2;i<l - 3;i++){
      m[i].point.lat = ( m[i-2].point.lat + m[i-1].point.lat+m[i].point.lat + m[i+1].point.lat + m[i+2].point.lat)/5;//没写完
    }
    m[l-2].point.lat=( 4 * m[l-1].point.lat + 3 * m[l-2].point.lat + 2 * m[l-3].point.lat + m[l-4].point.lat)/10;
    m[l-1].point.lat = ( 3 * m[l-1].point.lat + 2 * m[l-2].point.lat + m[l-3].point.lat - m[l-5].point.lat)/5;
  }
}
  
}

import { Component,OnInit,ChangeDetectionStrategy,ChangeDetectorRef,OnDestroy} from  "@angular/core";
//import { FormsModule } from "@angular/forms";
import {
  MapOptions, 
  Point, 
  MarkerOptions, 
  NavigationControlOptions, 
  ControlAnchor,
  NavigationControlType, 
  OverviewMapControlOptions, 
  ScaleControlOptions, 
  MapTypeControlOptions, 
  MapTypeControlType,
  GeolocationControlOptions,
  PolylineOptions
} from 'angular2-baidu-map';
//import { GpsService } from './gps.service';
import { GpsCoordService } from './gps-coord.service';
import { Marker } from "./model/marker";
import { Subregion } from "../model/subregion";
//import { GPS } from "./model/gps";
import { Sensor } from "../model/sensor";
import { WebsocketService } from "../websocket.service";
import { timeOption } from "../model/timeOption";

@Component({
  selector: 'app-gps-panel',
  templateUrl: './gps-panel.component.html',
  styleUrls: ['./gps-panel.component.css']
})
export class GpsPanelComponent implements OnInit {

  opts:MapOptions;
  controlOpts:NavigationControlOptions;
  overviewmapOpts:OverviewMapControlOptions;
  scaleOpts:ScaleControlOptions;
  mapTypeOpts:MapTypeControlOptions;
  geolocationOpts:GeolocationControlOptions


  public markers:Marker[] = [];
  public isShow:boolean = false;//控制该模块显示不显示
  public subregion: Subregion;//值从tab-control来
  //public GPSList:GPS[]=[];
  private _sensors: Sensor[];
  public OBDsensors:Sensor[] =[]; //存放OBD传感器
  //public marker:Marker = new Marker();//单个gps显示
  public gps:any;
  //public points:Array<Point>;
  public polylineOptions: PolylineOptions;
  public isReal:boolean = true;//默认显示实时位置界面
  public isHistory:boolean = false;//默认不显示历史轨迹

  public historyData:Array<Array<any>>;
  public historyMarkers:Marker[]=[]; //历史数据markers用于表格显示
  public points:Array<Point>=[];//历史数据points用于轨迹绘制

  private startDate = '';//起始时间
  private endDate = '';//结束时间
  private subregionName:string;//title




  constructor(
    private _gpsCoordService:GpsCoordService,
    private _websocketService:WebsocketService
  ){
    
    this.opts={
      centerAndZoom:{ //设置中心点和缩放级别，中心点要根据用户所在地设置
        lng:120.12, //经度
        lat:30.16,  //纬度
        zoom:13     //缩放级别
      },
      minZoom:3,//最小缩放级别的地图
      maxZoom:19,//最大缩放级别
      enableHighResolution:true, //是否使用高分辨率的地图，default:true
      enableAutoResize:true,//是否可以自动调整大小，default:true
      enableMapClick:true,//地图是否可以点击，default:true
      disableDragging:false,//是否禁用地图拖动功能
      enableScrollWheelZoom:true,//是否启用滚轮进行缩放功能
      disableDoubleClickZoom:true,//是否禁用双击缩放功能
      enableKeyboard:false,//是否启用键盘移动地图功能
      enableContinuousZoom:true,//是否启用连续缩放功能
      disablePinchToZoom:false,//是否禁用缩放功能的缩放
      currentCity:'杭州市'
    };

    this.polylineOptions = {
      strokeColor: 'blue',
      strokeWeight: 2
    }


    // 这是控件control
    this.controlOpts = {         // 导航控件
      anchor: ControlAnchor.BMAP_ANCHOR_TOP_LEFT,      // 显示的控件的位置
      type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE,   // 用来描述它是什么样的导航
      offset: {                                        // 控件的大小
        width: 30,
        height: 30
      },
      showZoomInfo: true,                             // 是否展示当前的信息
      enableGeolocation: true                         // 是否启用地理定位功能
    };

    this.overviewmapOpts = {    // 地图全景控件
      anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT,  // 显示的控件的位置
      isOpen: true                                    // whf 。。官网里没有说明？？
    };
    this.scaleOpts = {          // 比例尺控件
      anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_LEFT
    };
    this.mapTypeOpts = {        // 地图类型
      type: MapTypeControlType.BMAP_MAPTYPE_CONTROL_HORIZONTAL
    };

  }

  ngOnInit(){

    this._sensors = this.subregion.sensors;
    console.log(this._sensors);
    this._sensors.map(sensor => {
      if(sensor.category == "gps"){
        this.gps = this._gpsCoordService.GPSGenerator(sensor);
        console.log(this.gps);
        this.subregionName = this.gps.parentInfo.region.split('|')[1];
      }
      if(sensor.category == "OBDsensor"){
        this.OBDsensors.push(sensor);
      }
    });
    console.log(this.OBDsensors);
    /**
     * 接受websocket的实时数据，数据分为实时和历史数据两种
     * 实时数据返回：Message {name: "H0940@f3ab7880-9ecf-11e8-ad4b-4dd707116a31", data: {…}}
     * 历史数据查询返回：Message {name: "!H0940@f3ab7880-9ecf-11e8-ad4b-4dd707116a31", data: Array(77)}
     */
    this._websocketService.valSubject
    .map(msg=>{
      if(msg.name == `${this.gps.key}@${this.gps.parentInfo.entityId}`){
        this.gps.data = msg.data;
        this.gps.marker = this._gpsCoordService.handleGPSRawdata(msg.data.data);
        this.gps.marker.time = msg.data.time;
        this.gps.marker.title = this.gps.name;
        //一定要是个mark list，不知道为何百度地图了单独的marker显示不了
        this.markers[0] = this.gps.marker;

        //随marker改变地图中心点
        this.opts.centerAndZoom.lat=this.markers[0].point.lat;
        this.opts.centerAndZoom.lng=this.markers[0].point.lng;
        console.log(this.opts.centerAndZoom);
        console.log(this.markers[0]);
      }else if(msg.name == `!${this.gps.key}@${this.gps.parentInfo.entityId}`){
        //历史数据
        this.historyData = msg.data;
        console.log(msg.data);
        for(var tmp in msg.data){
          this.historyMarkers[tmp] = this._gpsCoordService.handleGPSRawdata(msg.data[tmp][1]);
          this.historyMarkers[tmp].time = msg.data[tmp][0];
          this.points.push(this.historyMarkers[tmp].point);
        }
        //this._gpsCoordService.smooth5(this.historyMarkers);
        console.log(this.historyMarkers);
        //console.log(this.points);
        this.isHistory = true;//当所有异步进程加载完以后再渲染polyline
      }
      /*this.OBDsensors.forEach((sensor)=>{
        if(msg.name == `${sensor.key}@${sensor.parentInfo.entityId}`){
          sensor.data = msg.data;
        }
        return sensor;
      })*/
    }
    ).subscribe();
    
/*
    //gps信息转换成marker信息存到markersTest里面
    this._gpsService.gpsSubject.subscribe(msg=>{
      console.log(msg);
      let hasThisEntity:boolean = false;
      
      let m = new Marker();
      m.entityId = msg.name;
      m.point = msg.data.point;
      m.title = msg.data.name;
      m.time = msg.data.data.time;
      
      console.log(m);
    if(this.markers.length == 0){
      this.markers.push(m);
    }else{

      for(let tmp in this.markers){
        if(msg.name === this.markers[tmp].entityId){
          this.markers[tmp] = m;
          hasThisEntity = true;
          break;
        }
      }
      if(!hasThisEntity){
        this.markers.push(m);
      }
    }
    console.log(this.markers);
    });
**/
  }

  loadMap(map:any){
    console.log('map instance here',map);
  }

  clickmap(e:any){
    console.log(`Map clicked with coordinate: ${e.point.lng}, ${e.point.lat}`);
  }
  //点击marker后的弹出框
  public showWindow({ e, marker, map }: any,mark): void {
  let t = new Date(mark.time).toLocaleString();
  let sContent = "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>"+mark.title+"</h4>"+
                 "<p>"+"最后更新时间："+t+"</p>";
    map.openInfoWindow(
      new window.BMap.InfoWindow(sContent,{
        offset: new window.BMap.Size(0, -30),
        //title: mark.options.title
      }),
      marker.getPosition()
    )
  }

  timeOption:timeOption = new timeOption();

  showHistory(gps):void{

    if(this.startDate.length == 0 || this.endDate.length == 0){
      console.log("未选择时间")
      alert('请选择起始时间与终止时间');
      return;
    }
    console.log(this.startDate);
    console.log(this.endDate);
    this.points = [];
    this.historyMarkers = [];
    //this.timeOption._timeIn = 365;//测试默认显示三日数据！！测试用！！
    this.isReal = false;//隐藏实时位置的marker
    this.isHistory = false;//每次查询数据都是一次新的过程，从发送ws数据到渲染历史轨迹曲线
    console.log("获取gps历史信息")
    //发送该gps信息获取历史信息的ws
    this._websocketService.getHistoryDataByDeviceIdWithStartAndEnd(gps.parentInfo.entityId,gps.key,this.startDate,this.endDate);
  }

  showReal():void{
    this.isReal = true;
    this.isHistory = false;
  }

}
   


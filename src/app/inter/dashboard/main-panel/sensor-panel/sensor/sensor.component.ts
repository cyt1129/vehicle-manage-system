import {Component, Input, OnInit,Output, EventEmitter} from '@angular/core';
import {Sensor} from "../../../model/sensor";
import {WebsocketService} from "../../../websocket.service";
//import {StockChart} from 'angular-highcharts';
import {EChartOption} from 'echarts-ng2';
import {timeOption} from './../../../model/timeOption';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {

  constructor(
    private _websocketService: WebsocketService,
    private sanitizer:DomSanitizer
  ) {
    
  }


@Output() periodChanged = new EventEmitter<any>();
 // stock:StockChart;
 //历史曲线
 chartOption :EChartOption;
 private _data: Array<Array<any>>;
 public historicalRecord:Array<any>;
 public uri:string;
 public trustedUri:any;
 //public url = "data:text/csv";
 //弹出框
 //历史曲线时间选择
 //加载中
 _isSpin = true;
timeoption1 = 7;
 public timeOption:timeOption = new timeOption();
 print(num:number){
   this.timeoption1 = num;
   this.timeOption._timeIn = this.timeoption1;
   this.periodChanged.emit({sensor: this.sensorAttr, timeOption: this.timeOption});
 }
  isVisible = false;

  showModal = () => {
    this.isVisible = true;
    this.timeoption1 = 7;
    this.print(this.timeoption1);
  }

  handleOk = (e) => {
    console.log('点击了确定');
    this.isVisible = false;
  }

  handleCancel = (e) => {
    console.log(e);
    this.isVisible = false;
  }
  public sensorType: SensorType = new SensorType();

  @Input() sensorAttr: Sensor;

  public value: number;
  public time : string;



  ngOnInit() {
    console.log("in sensor component:");
    console.log(this.sensorAttr);
    
    switch (this.sensorAttr.config.type){
      case "温度": {
        this.sensorType.classStr = "data-type-temperature";
        this.sensorType.imgUrl = "assets/img/datatypetemperature.png";
        // this.sensorType.unitStr = "℃";
        break;
      }
      case "光照": {
        this.sensorType.classStr = "data-type-sun";
        this.sensorType.imgUrl = "assets/img/datatypesun.png";
        // this.sensorType.unitStr = "KLux";
        break;
      }
      case "湿度": {
        this.sensorType.classStr = "data-type-shidu";
        this.sensorType.imgUrl = "assets/img/shidu.png";
        // this.sensorType.unitStr = "%";
        break;
      }
      case "二氧化碳": {
        this.sensorType.classStr = "data-type-co2";
        this.sensorType.imgUrl = "assets/img/co2.png";
        // this.sensorType.unitStr = "ppm";
        break;
      }
      default: {
        break;
      }
    }
    //取实时数据
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.sensorAttr.key}@${this.sensorAttr.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
         console.log(data);
        this.time = data.time;
        // this.time = this._datePipe.transform(data.time,'yyyy-MM-dd HH:mm:ss');

        this.value = data.data;
      });
    
    //取历史数据
    /*
    this._websocketService.historicalSubject
      .subscribe(sensor => {
        console.log(sensor);
*/
        this._websocketService.valSubject
          .subscribe(msg => {
            //console.log(msg);
            if(msg.name == `!${this.sensorAttr.key}@${this.sensorAttr.parentInfo.entityId}`){
              // subscribe for historical data.
              console.log(msg);
              this._data = msg.data;
              this._isSpin = false;
              this.chartOption = this.getOpt(this._data, this.sensorAttr.name);
              
              this.historicalRecord = this.historicalDataPackage(this._data);
              console.log(this.historicalRecord);

            }
            // else if(msg.name){
            //   // subscribe for latest data.
            //   let data = msg.data;
            //   let latest = [];
            //   latest.push(data.time);
            //   latest.push(data.data);
            // //   if(this._data.length >= 500){
            // //     this._data.shift();
            // // }
            // this._data.push(latest);
            // this._isSpin = false;
            // this.chartOption = this.getOpt(this._data, sensor.name);
           // }
          });
          /*
      });
     */ 
  }

  private getOpt(data: Array<Array<any>>, name: string): EChartOption {
    let opt = {
      title: {
        text: name
     },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      dataZoom: [{
       type: 'inside'
   }, {
       type: 'slider'
   }],
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: true
        }
      },
      series: [{
        name: name,
        type: 'line',
        itemStyle: {
          normal: {
            lineStyle: {
              color:'#1E90FF'
            }
          }
        },
        showSymbol: false,
        hoverAnimation: false,
       data: data
      }]
    };
    return opt;
   }

   private historicalDataPackage(data:any):any{
     var pkg = [];
     var str = "传感器名称,上报时间,值,单位\n";
     data.map(data=>{
         let record = {
           "name":this.sensorAttr.name,
           "time":data[0],
           "value":data[1],
           "unit":this.sensorAttr.config.type
         }
         pkg.push(record);
         str += `${this.sensorAttr.name},${data[0]+'\t'},${data[1]},${this.sensorAttr.config.unit}\n`
     });
     this.uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
     this.trustedUri = this.sanitizer.bypassSecurityTrustUrl(this.uri);
     //console.log(this.uri);
     return pkg;
   }

}

export class SensorType {
  "classStr": string;
  "imgUrl": string;
  // "unitStr": string;
}

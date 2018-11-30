import {Component, Input, OnInit} from "@angular/core";
import {EChartOption} from "echarts-ng2";
import {WebsocketService} from "../websocket.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-history-panel',
  templateUrl: './history-panel.component.html',
  styleUrls: ['./history-panel.component.css']
})
export class HistoryPanelComponent  {

  @Input() deviceId:string;
  option :EChartOption; 

   constructor(private _websocketService: WebsocketService) {
     // this.option = this.getOpt([[],[],[]]);
   }
   
   private _data: Array<Array<any>>;

   ngOnInit() {
     this._websocketService.historicalSubject
       .subscribe(sensor => {

         this._websocketService.valSubject
           .subscribe(msg => {

             if(msg.name == `!${sensor.key}@${sensor.parentInfo.entityId}`){
               // subscribe for historical data.
               this._data = msg.data;
               this.option = this.getOpt(this._data, sensor.name);
             }else if(msg.name){
               // subscribe for latest data.
               let data = msg.data;
               //console.log(data);
               let latest = [];
               latest.push(data.time);
               latest.push(data.data);
            //    if(this._data.length >= 50){
            //      this._data.shift();
            //  }
             this._data.push(latest);
             this.option = this.getOpt(this._data, sensor.name);
             }
           })
       });
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
           show: false
         }
       },
       series: [{
         name: '模拟数据',
         type: 'line',
         showSymbol: false,
         hoverAnimation: false,
        data: data
       }]
     };
     return opt;
   }
 }

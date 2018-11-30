import { Component, OnInit,Input } from '@angular/core';
import { Sensor } from '../../model/sensor';
import { WebsocketService } from '../../websocket.service';

@Component({
  selector: 'app-obd',
  templateUrl: './obd.component.html',
  styleUrls: ['./obd.component.css']
})
export class ObdComponent implements OnInit {

  constructor(private _websocketService:WebsocketService) { }

  @Input() obd:Sensor;
  public value:number;
  public time:string;
  public min:number;
  public max:number;
  public unit:string;
  public previousValue = 20;//前一个width值
  public currentValue = 20;//当前的width值

  ngOnInit() {
    this._websocketService.valSubject
      .filter(msg => msg.name == `${this.obd.key}@${this.obd.parentInfo.entityId}`)
      .map(msg => msg.data)
      .subscribe(data => {
         console.log(data);
        this.time = data.time;
        this.value = parseFloat(data.data);
      });
    
    this.min = parseInt(this.obd.config.min);
    this.max = parseInt(this.obd.config.max);
    this.unit = this.obd.config.unit;
  }
  /**控制条的宽度 */
  generateWidth(value:number,min:number,max:number):string{
    this.previousValue = this.currentValue;
    var result = (value-min)/(max-min) * 100;
    if(result > 100){
      this.currentValue = 100;
      return '100%';
    }
    else if(result < 25){
      this.currentValue = 25;
      return '25%';
    }else{
      this.currentValue = result;
      return result+'%';
    }
  }
}

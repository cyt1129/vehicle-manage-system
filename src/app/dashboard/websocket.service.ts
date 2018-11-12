import {Injectable} from "@angular/core";
import {WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/dom/webSocket";
import {CmdWrapper} from "./model/websocketCmd/cmd-wrapper";
import {AttrCmd} from "./model/websocketCmd/attr-cmd";
import {isNullOrUndefined} from "util";
import {Subject} from "rxjs/Subject";
import {Message} from "./model/message";
import {TimeseriesCmd} from "./model/websocketCmd/timeseries-cmd";
import {environment} from "../../environments/environment";
import {Sensor} from "./model/sensor";

@Injectable()
export class WebsocketService {

  public webSocketSubject: WebSocketSubject<any>;

  public attrSubject: Subject<Message> = new Subject();
  public valSubject: Subject<Message> = new Subject();

  public historicalSubject: Subject<Sensor> = new Subject();


  private _cmdId: number = 0;

  // attribute register map. (cmdId: entityId)
  private _t_attr = new Map();

  // value register map. (cmdId: entityId)
  private _t_val = new Map();

  constructor() {
    let token = localStorage.getItem("token");
    // console.log("using token: " + token);
    //let websocketUrl = `ws://${environment.serverUrl}/api/ws/plugins/telemetry?token=` + token;
    let websocketUrl = `ws://140.143.23.199:8080/api/ws/plugins/telemetry?token=` + token;
    console.log("connecting to: " + websocketUrl);
    this.webSocketSubject = Observable.webSocket(websocketUrl);

    this.cmdRegister();//处理webSocketSubject
    this.handleAttrMsgSubscription();//生成属性的
    this.handleTimeSeriesMsgSubscription();//储存实时数据的

    //this.webSocketSubject.next(`{"attrSubCmds":[{"entityId":"7196de30-5712-11e7-bcd4-df254d8c8582","scope":"SERVER_SCOPE","cmdId":2},{"entityId":"f37c8940-5bdb-11e7-9680-df254d8c8582","scope":"SERVER_SCOPE","cmdId":3}]}`);
  }

  getLatestDeviceDataByDeviceIds(entityIds: string[]): void {
    let cmd = this.latestValCmdGenerator(entityIds);
    // console.log(cmd);
    this.webSocketSubject.next(cmd);
  }

  getRegionDataByDeviceIds(entityIds: string[]): void {
    let cmd = this.attrCmdGenerator(entityIds, "SERVER_SCOPE");
    this.webSocketSubject.next(cmd);
  }

  getHistoryDataByDeviceId(entityId: string, sensorKey:string,timeOption:any): void{
    let cmd = new CmdWrapper();
    cmd.tsSubCmds = [];
    const timeSeriesCmd = new TimeseriesCmd();
    timeSeriesCmd.entityId = entityId;
    timeSeriesCmd.timeWindow = timeOption._timeIn*24*3600000  ;
    timeSeriesCmd.startTs = new Date().getTime() - timeOption._timeIn*24*3600000;
    // timeSeriesCmd.startTs = 1498118852000;
    // timeSeriesCmd.timeWindow = new Date().getTime() -  1498118852000 ;

    timeSeriesCmd.limit = 50000;
    timeSeriesCmd.entityType="DEVICE";

    timeSeriesCmd.interval = 1000*5;
    // timeSeriesCmd.agg = "AVG";
    timeSeriesCmd.keys = sensorKey;
    timeSeriesCmd.cmdId = this._cmdId ++;
    cmd.tsSubCmds.push(timeSeriesCmd);

    console.log(cmd);
    console.log(JSON.stringify(cmd));
    this.webSocketSubject.next(JSON.stringify(cmd));
  }

  private handleTimeSeriesMsgSubscription(): void{//处理valSubject
    this.webSocketSubject.filter(msg => !isNullOrUndefined(this._t_val[msg.subscriptionId]))//是否有subscrpId这项和是否在设备列表中
      .subscribe(msg => {
        console.log(msg);
        if(msg.errorCode == 0){
          let data = msg.data;
          console.log(data);//实验
          for(let tmp in data){
            if(data[tmp].length > 1){//如果data数超过1就是历史数据，历史数据的message前面有个！
              // history data.
              console.log(new Message(`!${tmp}@${this._t_val[msg.subscriptionId]}`,data[tmp]));
              this.valSubject.next(new Message(`!${tmp}@${this._t_val[msg.subscriptionId]}`,data[tmp]));
            }else{
              // latest data.
              let valList = data[tmp][0];
              let val = {
                time: valList[0],
                data: valList[1]
              };
              console.log(new Message(`${tmp}@${this._t_val[msg.subscriptionId]}`,val));
              this.valSubject.next(new Message(`${tmp}@${this._t_val[msg.subscriptionId]}`,val));
            }
          }
        }
      });
  }

  private handleAttrMsgSubscription(): void{
    //this.webSocketSubject.filter(msg => !isNullOrUndefined(msg.subscriptionId))
    this.webSocketSubject.filter(msg => !isNullOrUndefined(this._t_attr[msg.subscriptionId]))//在设备列表里有没有这个设备
      .subscribe(msg => {
          console.log(msg);//处理服务端属性
          if (msg.errorCode == 0) {
            let data = msg.data;
            for (let tmp in data) {
              let attrList = data[tmp];
              for (let i = 0; i < attrList.length; i++) {
                if (msg.latestValues[tmp] == attrList[i][0]) {
                  // let regionStr = JSON.parse(attrList[i][1]).region;
                  // this.msgSubject.next(new Message("region",
                  //   `${this._t_attr[msg.subscriptionId]}@${regionStr}`));
                  let config = JSON.parse(attrList[i][1]);
                  config["entityId"] = this._t_attr[msg.subscriptionId];
                  config["key"] = tmp;
                  console.log(config);
                  // if(config.category == "amperemeter"){
                  //   //console.log("nope");
                  //   this.attrSubject.next(new Message("ampereCfg",config));
                  // }else{
                  //   this.attrSubject.next(new Message("sensorCfg",config));
                  // }
                  this.attrSubject.next(new Message("sensorCfg",config));
                  console.log(new Message("sensorCfg",config));
                }
              }
            }
          }
        },
        (err) => {console.log(err)}
        );
  }

  /**
   * save the cmdId and entityId relationship.
   */
  private cmdRegister(): void{
    this.webSocketSubject
      .filter(msg => isNullOrUndefined(msg.subscriptionId))//收到的socket信息里没有subscriptionId这项
      .subscribe(
        (msg) => {
          console.log("cmdRegister");
          console.log(msg);
          if (!isNullOrUndefined(msg.attrSubCmds)) {//有attrSubCmds这项
            msg.attrSubCmds.map(ele => {
              this._t_attr[ele.cmdId] = ele.entityId;//找到cmdId和entityId的对应关系，一个cmdId对应一个设备
              console.log(this._t_attr[ele.cmdId]);
              console.log(ele.cmdId);
            });
          }
          if (!isNullOrUndefined(msg.tsSubCmds)) {//有tsSubCmds这项，和attrSub有什么区别
            msg.tsSubCmds.map(ele => {
              this._t_val[ele.cmdId] = ele.entityId;
              console.log(this._t_val[ele.cmdId]);
              console.log(ele.cmdId);
            })
          }
        },
        (err) => console.log(err)
      )
  }

  /**
   * generate websocket subscribe cmd for device real-time values.
   * @param entityIdList
   * @returns {string}
   */
  private latestValCmdGenerator(entityIdList: string[]): string{
    let cmd = new CmdWrapper();
    cmd.tsSubCmds = [];
    entityIdList.map(devicdid => {
      let timeSeriesCmd = new TimeseriesCmd();
      timeSeriesCmd.entityId = devicdid;
      timeSeriesCmd.scope = "LATEST_TELEMETRY";
      timeSeriesCmd.cmdId = this._cmdId++;
      timeSeriesCmd.entityType = "DEVICE";
      cmd.tsSubCmds.push(timeSeriesCmd);
    });

    return JSON.stringify(cmd);
  }

  /**
   * generate websocket subscribe cmd for device attributes.
   * @param entityIdList
   * @param scope
   * @returns {string}
   */
  private attrCmdGenerator(entityIdList: string[], scope: string): string {
    let cmd = new CmdWrapper();
    cmd.attrSubCmds = [];
    entityIdList.map(entityId => {
      let attrCmd = new AttrCmd();
      attrCmd.entityId = entityId;
      attrCmd.entityType="DEVICE";
      attrCmd.scope = scope;
      attrCmd.cmdId = this._cmdId++;
      cmd.attrSubCmds.push(attrCmd);
    });
    return JSON.stringify(cmd);
  }
}

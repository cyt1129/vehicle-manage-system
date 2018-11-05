import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
  Output,
  EventEmitter
} from "@angular/core";
import {MainPanelComponent} from "../main-panel/main-panel.component";
import {Subregion} from "../model/subregion";
import {Sensor} from "../model/sensor";
import { GpsPanelComponent } from "../gps-panel/gps-panel.component";

@Component({
  selector: 'app-tab-control',
  templateUrl: './tab-control.component.html',
  styleUrls: ['./tab-control.component.css']
})
export class TabControlComponent implements OnInit, AfterContentInit {

  @ViewChild('mainPanel', {read: ViewContainerRef}) mainPanel;//container容器：放置组建的地方

  @Output() sensorClkEvent = new EventEmitter<Sensor>();

  public relationList: Array<Relation> = [];

  private _currentActiveTitle = "";
  private currentPanelType = "main";
  private _currentActiveRegion:Subregion;


  constructor(private _resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.mainPanel.clear();//mainPanel就是一个div元素，初始化的时候将div清除
    //console.log('**************div被删除'+this.relationList.length);
  }

  ngAfterContentInit(): void {
    console.info(this.mainPanel);
  }

  addPanel(subregion: Subregion): void {
    //一次性把main和gps都加载了
    let bc = this.relationList.filter(relation => relation.title == subregion.subregionName).length>0;
    //找一找relationlist里有没有这个区域
    if(!bc){
      const mainPanelFactory = this._resolver.resolveComponentFactory(MainPanelComponent);
      const ref = this.mainPanel.createComponent(mainPanelFactory);
      //调用resolveComponentFactory服务以mainpannelComponent类为模板创建组件

      //创建gpspanel
      const gpsPanelFactory = this._resolver.resolveComponentFactory(GpsPanelComponent);
      const gpsref = this.mainPanel.createComponent(gpsPanelFactory);

      ref.instance.subregion = subregion;//这句话非常重要，将subregion参数传入新创建的mainpanel的实例中去。所以mainpanel的subregion是这么来的。。
      gpsref.instance.subregion = subregion;//将region数据传给gps-panel
      this.relationList.push(new Relation(subregion.subregionName, subregion, ref,gpsref));
      console.log(this.relationList);
      
    }
    console.log(this.mainPanel);
    this.activePanel(subregion);
  }

  //closePanel目前没用，除非在右上角加一个关掉的键
  closePanel(subregionName: string): void {
    //let relation = this.relationList.filter(relation=>relation.title == subregionName);
    //console.log(relation);
    let containerRef = this.relationList.filter(relation => relation.title == subregionName)[0].ref;
    containerRef.destroy();

    // TODO websocket subscribe needs to be released
    // containerRef.onDestroy();

    this.relationList = this.relationList.filter(relation => relation.title != subregionName);

    try {
      this._currentActiveTitle = this.relationList[this.relationList.length - 1].title;
      this.activePanel(this.relationList[this.relationList.length - 1].subregion);
    }catch (err) {
      this._currentActiveTitle = "";
    }

    console.log(this.relationList);
  }

  activePanel(subregion: Subregion): void {
    this._currentActiveTitle = subregion.subregionName;
    this._currentActiveRegion = subregion;
    this.relationList.map(relation => {
      relation.ref.instance.isShow = false;
      relation.gpsref.instance.isShow = false;
    });
    let ref = this.relationList.filter(relation => relation.title == subregion.subregionName)[0].ref;
    let gpsref = this.relationList.filter(relation => relation.title == subregion.subregionName)[0].gpsref;
    
    if(this.currentPanelType == "main"){
      ref.instance.isShow = true;
    }else gpsref.instance.isShow = true;
  }

  //控制两个tab键的样式
  isActive(name: number): string {
    let type:string="";
    if (name == 1){
      type = "gps";
    }else type ="main";
      
    if(type == this.currentPanelType)
      return "on";
    else
      return "";
  }
  //hasSubregionhao目前没用
  hasSubregion(subregion: Subregion): boolean {
    for (let idx in this.relationList) {
      let relation = this.relationList[idx];
      if (JSON.stringify(relation.subregion) == JSON.stringify(subregion)) {
        return true;
      }
    }
    return false;
  }

  changePanelType(type:number):void{
    if(type == 0){
      this.currentPanelType = "main";
    }else{
      this.currentPanelType = "gps";
    }
    //console.log(this._currentActiveRegion);
    if(this._currentActiveRegion !== undefined){
      this.activePanel(this._currentActiveRegion);
    }else console.log("区域未激活");
    
  }

}

class Relation {
  title: string;
  subregion: Subregion;
  ref: any;
  gpsref:any;

  constructor(title: string, subregion: Subregion, ref: any,gpsref:any) {
    this.title = title;
    this.subregion = subregion;
    this.ref = ref;
    this.gpsref = gpsref;
  }
}

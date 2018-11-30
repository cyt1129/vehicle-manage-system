import {AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren} from "@angular/core";
import {isNullOrUndefined} from "util";
import {TwoStateComponent} from "./two-state/two-state.component";
import {ThreeStateComponent} from "./three-state/three-state.component";

@Component({
  selector: 'app-controller-panel',
  templateUrl: './controller-panel.component.html',
  styleUrls: ['./controller-panel.component.css']
})
export class ControllerPanelComponent implements OnInit, AfterViewInit {

  // hide batch control buttons by default.
  public is2StatBatCtrlBtnShow: boolean = false;
  public is3StatBatCtrlBtnShow: boolean = false;

  @Input() controllerList: any[];
  @Input() asList: any[];

  twoStatCtrlList: any[];
  threeStatCtrlList: any[];

  @ViewChildren(TwoStateComponent)
  private twoStatCtrlComponent: QueryList<TwoStateComponent>;
  @ViewChildren(ThreeStateComponent)
  private threeStatCtrlComponent: QueryList<ThreeStateComponent>;

  constructor() {
    this.twoStatCtrlList = [];
    this.threeStatCtrlList = [];
  }

  private getAmpSensorCfgByKey(key: string): Object {
    if (!isNullOrUndefined(key)) {
      for (let i = 0; i < this.asList.length; i++) {
        if (this.asList[i].key == key)
          return this.asList[i];
      }
    }
    return null;
  }

  ngOnInit() {
    // console.log(this.controllerList);
    // console.log(this.asList);
    this.controllerList.map(controller => {
      if (controller.config.type == "两态可控") {
        let ctrlInfo: ControllerInfo = new ControllerInfo();
        ctrlInfo.controller = controller;
        ctrlInfo.ampereSensor.push(this.getAmpSensorCfgByKey(controller.config.cur_key));
        ctrlInfo.ampereSensor.push(this.getAmpSensorCfgByKey(controller.config.max_cur_key));

        this.twoStatCtrlList.push(ctrlInfo);
      }
      if (controller.config.type == "三态可控") {
        let ctrlInfo: ControllerInfo = new ControllerInfo();
        ctrlInfo.controller = controller;
        ctrlInfo.ampereSensor.push(this.getAmpSensorCfgByKey(controller.config.on_cur_key));
        ctrlInfo.ampereSensor.push(this.getAmpSensorCfgByKey(controller.config.max_on_cur_key));
        ctrlInfo.ampereSensor.push(this.getAmpSensorCfgByKey(controller.config.off_cur_key));
        ctrlInfo.ampereSensor.push(this.getAmpSensorCfgByKey(controller.config.max_off_cur_key));

        this.threeStatCtrlList.push(ctrlInfo);
      }
    });
    // console.log(this.twoStatCtrlList);
    // console.log(this.threeStatCtrlList);
  }

  ngAfterViewInit() {
    console.info(this.twoStatCtrlComponent);
    console.info(this.threeStatCtrlComponent);
  }

  /**
   * toggle batch control button display.
   */
  on2StatBatchControlClk() {
    this.is2StatBatCtrlBtnShow = !this.is2StatBatCtrlBtnShow;
  }
  on3StatBatchControlClk() {
    this.is3StatBatCtrlBtnShow = !this.is3StatBatCtrlBtnShow;
  }

  on2StatBatchChk(domElement: HTMLInputElement) {
    console.info(domElement);
    if (domElement.checked) {
      this.twoStatCtrlComponent.map(twoStatComponent => {
        twoStatComponent.isChecked = true;
      });
    } else {
      this.twoStatCtrlComponent.map(twoStatComponent => {
        twoStatComponent.isChecked = false;
      });
    }
  }

  on3StatBatchChk(domElement: HTMLInputElement) {
    console.info(domElement);
    if (domElement.checked) {
      this.threeStatCtrlComponent.map(threeStatComponent => {
        threeStatComponent.isChecked = true;
      });
    } else {
      this.threeStatCtrlComponent.map(threeStatComponent => {
        threeStatComponent.isChecked = false;
      });
    }
  }

  chkEventHandler(ele: HTMLInputElement, stat: number) {
    if (stat == 2) {
      let currentSelectedNum = this.twoStatCtrlComponent.filter(c => c.isChecked).length;
      if (currentSelectedNum < this.twoStatCtrlComponent.length) {
        ele.checked = false;
      } else {
        ele.checked = true;
      }
    } else if (stat == 3) {
      let currentSelectedNum = this.threeStatCtrlComponent.filter(c => c.isChecked).length;
      if (currentSelectedNum < this.threeStatCtrlComponent.length) {
        ele.checked = false;
      } else {
        ele.checked = true;
      }
    }
  }

  onTwoStatBatchControl(cmd: string): void{
    this.twoStatCtrlComponent
      .filter(c => c.isChecked)
      .map(c => {
        c.onCtrlBtnClk(cmd);
      });
  }

  onThreeStatBatchControl(cmd: string): void{
    this.threeStatCtrlComponent
      .filter(c => c.isChecked)
      .map(c => {
        c.onCtrlBtnClick(cmd);
      });
  }
}

class ControllerInfo {
  controller: any;
  ampereSensor: any[] = [];
}

import {Component, ViewChild,OnInit} from "@angular/core";
import { RegionService } from "./region-panel/service/region.service";
import { Subregion } from "./model/subregion";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  @ViewChild('tabCtrl') tabCtrl;
  public subregion:Subregion;

  constructor(
    private _regionService:RegionService
  ) {}

  ngOnInit(){
      //this.tabCtrl.addPanel()
  }

  onRegionSelect(subregion): void {
    this.subregion = subregion;
    console.info(subregion);

    if(this.tabCtrl.hasSubregion(subregion)){
      this.tabCtrl.activePanel(subregion);
    }else{
      this.tabCtrl.addPanel(subregion);
    }
  }

  firstRegion(subregion):void{
    console.log(subregion);
    this.tabCtrl.addPanel(subregion);
  }

}

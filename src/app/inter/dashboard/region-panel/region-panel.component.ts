import {AfterViewChecked, Component, EventEmitter, OnInit, Output,AfterViewInit} from "@angular/core";
import {RegionService} from "./service/region.service";
import {Region} from "../model/region";
import {Subregion} from "../model/subregion";
//import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-region-panel',
  templateUrl: './region-panel.component.html',
  styleUrls: ['./region-panel.component.css'],
  providers: [RegionService]
})
export class RegionPanelComponent implements OnInit,AfterViewChecked{

  @Output()
  public regionEvent = new EventEmitter<Subregion>();
  @Output() public firstRegion = new EventEmitter<Subregion>();

  public regionList: Region[];

  constructor(
    private _regionService: RegionService
  ) {  }

  ngOnInit() {
    this._regionService.getRegionDataFromWs()
      .subscribe(data => {
        console.log(data);
        //console.log(data[0]);
        this.regionList = data;
        //console.log(this.regionList[0]);
        //this.firstRegion.emit(this.regionList[0].subRegions[0]);
      })
      //console.log(this.regionList);
      
  }

  ngAfterViewChecked() {

    // try {
    //   this.regionClick(this.regionList[0].subRegions[0]);
    // }catch (err) {
    // }
    //console.log(this.regionList[0]);
  }
  regionClick(obj: Subregion) {
    this.regionEvent.emit(obj);
  }

  regionOnload(obj:Subregion){
      console.log(obj);
  }

}

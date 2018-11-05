import {Subregion} from "./subregion";

export class Region {
  regionName: string;
  subRegions: Subregion[];
  constructor(){
    this.subRegions = [];
  }
}

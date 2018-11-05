import {Sensor} from "./sensor";
export class Subregion {
  subregionName: string;
  entityIds: string[];
  sensors: Sensor[];

  constructor() {
    this.entityIds = [];
    this.sensors = [];
  }
}

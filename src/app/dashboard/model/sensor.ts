import {isNullOrUndefined} from "util";
export class Sensor {
  key: string;
  name: string;
  category: string;
  trans: number[];
  config: any;

  parentInfo: ParentInfo = new ParentInfo();

  constructor(sensorCfg: any) {
    if(!isNullOrUndefined(sensorCfg.key))
      this.key = sensorCfg.key;

    if(!isNullOrUndefined(sensorCfg.name))
      this.name = sensorCfg.name;

    if(!isNullOrUndefined(sensorCfg.trans))
      this.trans = sensorCfg.trans;

    if(!isNullOrUndefined(sensorCfg.category))
      this.category = sensorCfg.category;

    if(!isNullOrUndefined(sensorCfg.config))
      this.config = sensorCfg.config;

    this.parentInfo.region = sensorCfg.region;
    this.parentInfo.entityId = sensorCfg.entityId;
  }
}

export class ParentInfo {
  region: string;
  entityId: string;
}

import {DeviceAttrConfig} from './device-attr-config';
import {Amperemeter} from './amperemeter';
export class DeviceAttr {
  lastUpdateTs: string;
  isChecked:boolean;
  key: string;
  name:string;
  region:string;
  category:string;
  config:DeviceAttrConfig;
  ref: any;
  // amperemeter:Amperemeter;


  //电流
  ref_item:string;
  ref_key:string;
  unit:string;

  //controler
  control_addr:string ;
  on: string;
  off: string;
  stop: string;
  batch_on: string;
  batch_off: string;
  cunit: string;
  batch_stop: string;
  on_cur_key: string;
  max_on_cur_key: string;
  off_cur_key: string;
  max_off_cur_key: string;
  cur_key:string;
  max_cur_key:string;
  
}

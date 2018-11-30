import {Amperemeter} from './amperemeter';
export class TwoStateConfig {
  control_addr: string;
  type: string;
  on: string;
  stop:string;
  batch_on:string;
  batch_stop:string;
  cur_key:string;
  max_cur_key:string;
  cur_key_ref:Amperemeter;
  max_cur_key_ref:Amperemeter;

}

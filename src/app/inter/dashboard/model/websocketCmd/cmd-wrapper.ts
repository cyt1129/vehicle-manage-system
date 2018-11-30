import {AttrCmd} from "./attr-cmd";
import {TimeseriesCmd} from "./timeseries-cmd";
export class CmdWrapper {
  attrSubCmds: AttrCmd[];
  tsSubCmds: TimeseriesCmd[];
}

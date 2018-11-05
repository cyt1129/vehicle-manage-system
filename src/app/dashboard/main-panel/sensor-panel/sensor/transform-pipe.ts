import {Pipe, PipeTransform} from "@angular/core";
import {isNullOrUndefined} from "util";
@Pipe({
  name: "transform"
})
export class TransformPipe implements PipeTransform {
  transform(rawValue: number, transCfg: Array<number>): string {
    if (isNullOrUndefined(transCfg) || transCfg.length != 4) {
      return rawValue.toString();
    } else {
      let a = transCfg[0];
      let b = transCfg[1];
      let c = transCfg[2];
      let d = transCfg[3];

      let result = (d - c) / (b - a) * rawValue + c;
      return result.toFixed(2);
    }
  }
}

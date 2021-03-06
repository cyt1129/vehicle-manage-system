import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe'
})
export class TimePipePipe implements PipeTransform {

  transform(value: any): any {
    let unixTime = new Date(value);
    let year = unixTime.getFullYear();
    let month = unixTime.getMonth()+1;
    let day = unixTime.getDate();
    let hour = this.add0(unixTime.getHours());
    let minute = this.add0(unixTime.getMinutes());
    let second = this.add0(unixTime.getSeconds());

    let str = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return str;
  }

  add0(value:number):string{
    var str = value.toString();
      if(str.length<2){
        str = '0'+str;
      }
    return str;
  }

}

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
    let hour = unixTime.getHours();
    let minute = unixTime.getMinutes();
    let second = unixTime.getSeconds();

    let str = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return str;
  }

}

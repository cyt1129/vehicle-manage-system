export class timeOption{
    public _timeIn:number;
    get timeIn() :number{
        return this._timeIn;
    }
    set timeIn(value:number) {
        if(value){
            this._timeIn = value;
        }
    }
    
}
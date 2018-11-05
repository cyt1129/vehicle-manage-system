export class TimeseriesCmd {
  entityId: string;
  scope: string;
  cmdId: number;
  entityType:string;

  keys: string;
  startTs: number;
  endTs: number;
  timeWindow: number;
  interval: number;
  limit: number;
  agg: string;
}

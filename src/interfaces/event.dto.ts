export interface EventDto {
  eventName: string;
  dataList: Array<any>;
}

export interface EventIdDto {
  eventId: string;
}

export interface EventTimeDto extends EventIdDto {
  user: string;
  timeList: Array<any>;
}

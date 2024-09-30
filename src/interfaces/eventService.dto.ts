export interface UserTime {
  userName: string;
  date: Date;
  time: number;
}

export interface SortedUserTime {
  userName: string;
  timeList: Array<{
    date: Date;
    time: number[];
  }>;
}

export interface GetEventResponse {
  result: boolean;
  resultList?: SortedUserTime[];
  dateList?: Date[];
  userList?: string[];
  message: string;
}
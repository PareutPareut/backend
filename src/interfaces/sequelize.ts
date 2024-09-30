export interface EventsAttributes {
  eventId?: number;
  eventName: string;
}

export interface UsersAttributes {
  userId: number;
  eventId: number;
  userName: string;
  password: string;
}

export interface EventDatesAttributes {
  eventId: number;
  date: Date;
}

export interface UserTimesAttributes {
  userTimeId?: number;
  userName: string;
  eventId: number;
  date: Date;
  time: string;
}

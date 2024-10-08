import { ApiResponse } from "./apiResponse";
import { SortedUserTime } from "./eventService.dto";

export interface EventListsResponse extends ApiResponse {
  resultList: SortedUserTime[];
  dateList: Date[];
  userList: string[];
}

export interface NewEventResponse extends ApiResponse {
  eventId: number;
  eventName: string;
}

import { ApiResponse } from "../interfaces/apiResponse";
import { EventListsResponse, NewEventResponse } from "../interfaces/eventResponse";

export function isNewEventResponse(response: ApiResponse): response is NewEventResponse {
  return (response as EventListsResponse).resultList !== undefined;
}

import { ApiResponse } from "../interfaces/apiResponse";
import { NewEventResponse } from "../interfaces/eventResponse";

export function isNewEventResponse(response: ApiResponse): response is NewEventResponse {
  return (response as NewEventResponse).eventId !== undefined;
}

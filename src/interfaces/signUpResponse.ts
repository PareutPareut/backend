import { ApiResponse } from "./apiResponse";

interface SessionData {
  id: number;
  userName: string;
}

export interface SignUpResponse extends ApiResponse {
  sessionData: SessionData | null;
}

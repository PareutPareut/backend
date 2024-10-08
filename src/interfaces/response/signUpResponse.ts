import { ApiResponse } from "./response/apiResponse";

interface SessionData {
  id: number;
  userName: string;
}

export interface SignUpResponse extends ApiResponse {
  sessionData: SessionData | null;
}

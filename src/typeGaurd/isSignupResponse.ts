import { ApiResponse } from "../interfaces/apiResponse";
import { SignUpResponse } from "../interfaces/signUpResponse";

export function isSignUpResponse(response: ApiResponse): response is SignUpResponse {
  return (response as SignUpResponse).sessionData !== undefined;
}

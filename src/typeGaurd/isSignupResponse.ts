import { SignUpResponse } from "../interfaces/signUpResponse";

// 성공한 응답인지 확인하는 타입 가드
export function isSignUpResponse(
  response: SignUpResponse
): response is SignUpResponse & { sessionData: { id: number; userName: string } } {
  return response.result === true && response.sessionData !== null;
}

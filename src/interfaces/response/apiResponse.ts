export interface ApiResponse<T = undefined> {
  result: boolean;
  message: string;
  data?: T;
}

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  meta: unknown;
}

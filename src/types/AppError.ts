export class AppError {
  source: string;
  code: string;
  message: string;
  status?: number;
  details?: Record<string, unknown>;

  constructor(
    source: string,
    code: string,
    message: string,
    status?: number,
    details?: Record<string, unknown>,
  ) {
    this.source = source;
    this.code = code;
    this.message = message;
    this.status = status;
    this.details = details;
  }

  static isError(value: unknown): boolean {
    return !!(value instanceof AppError);
  }
}

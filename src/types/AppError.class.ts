export class AppError {
  source: string;
  message: string;
  status?: number;
  details?: Record<string, unknown>;

  constructor(
    source: string,
    message: string,
    status?: number,
    details?: Record<string, unknown>,
  ) {
    this.source = source;
    this.message = message;
    this.status = status;
    this.details = details;
  }

  static isError(value: unknown): boolean {
    return (
      typeof value === "object" &&
      value !== null &&
      "source" in value &&
      typeof (value as any).source === "string" &&
      "message" in value &&
      typeof (value as any).message === "string"
    );
  }
}

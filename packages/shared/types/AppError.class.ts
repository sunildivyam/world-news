/* eslint-disable @typescript-eslint/no-explicit-any */
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

  parse(error: any, status?: number): AppError {
    this.message =
      error?.message || error?.error?.message || error?.error || "";
    this.status = status || error?.status || error?.code || undefined;
    return this;
  }

  set(
    message: string,
    status: number,
    details?: Record<string, unknown>,
  ): AppError {
    this.status = status || undefined;
    this.message = message || "";
    if (details) this.details = { ...details };

    return this;
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

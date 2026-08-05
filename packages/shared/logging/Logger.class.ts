/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "../types";

const error = new AppError("Logger", "", 400);

export interface LoggerOptions {
  toConsole?: boolean;
  toFile?: boolean;
  filePath?: string;
  toCache?: boolean;
  cacheSize?: number; // max number of logs
  maxLogSize?: number; // bytes
}

export class Logger {
  private _options: LoggerOptions = {
    toConsole: true,
    toFile: true,
    filePath: "",
    toCache: true,
    cacheSize: 100, // max number of logs
    maxLogSize: 1024, // bytes
  };

  _logs: string[] = [];
  _onLog = (logs: string[]) => {};

  constructor(options: LoggerOptions, cb: (logs: string[]) => void) {
    this._options = { ...this._options, ...options };
    this._options.cacheSize = options.cacheSize || 100;
    this._options.maxLogSize = options.maxLogSize || 1024;
    if (typeof cb === "function") this._onLog = cb;
  }

  private isLogSizeValid(log: string): boolean {
    if (log.length <= this._options.maxLogSize!) return true;
    return false;
  }

  private isCacheFull(): boolean {
    if (this._logs.length >= this._options.cacheSize!) return true;
    return false;
  }

  private removeLeastRecentLog() {
    const [_removed, ...logs] = this._logs;
    this._logs = logs;
  }

  private addLog(log: string) {
    // Check log size
    if (!this.isLogSizeValid(log))
      throw error.set(
        `Log size exceeds the limit of ${this._options.maxLogSize} bytes`,
        40,
      );

    // Check if cache is full, then remove the least recent log
    if (this.isCacheFull()) {
      this.removeLeastRecentLog();
    }

    // add log
    this._logs.push(log);

    // notify log via CB
    if (typeof this._onLog === "function") this._onLog(this._logs);

    // console.log
    if (this._options.toConsole) console.log(log);

    // Send to File

    // Send to other sources
  }

  public log(...args: any) {
    const _args = args.map((ar: any) =>
      typeof ar === "object" ? JSON.stringify(ar) : ar,
    );

    this.addLog(_args.join(""));
  }
}

import { Response } from "express";

export class ApiResponse<T> {
  private _message: string = '';
  private _data: T | null = null;
  private _success: boolean = true;
  constructor(message: string, data: T | null, success: boolean) {
    this._message = message;
    this._data = data;
    this._success = success;
  }

  error(res: Response, status: number = 500) {
    res.status(status).json({
      message: this._message,
      data: this._data,
      success: this._success
    })
  }

  success(res: Response, status: number = 200) {
    res.status(status).json({
      message: this._message,
      data: this._data,
      success: this._success
    })
  }
}
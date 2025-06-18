import { Response } from "express";

export class ApiResponse<T> {
  private _message: string = '';
  private _data: T | undefined = undefined;
  constructor(message?: string, data?: T | undefined) {
    this._message = message || "";
    this._data = data;
  }

  error(res: Response, status: number = 500) {
    res.status(status).json({
      message: this._message,
      data: this._data,
    })
  }

  success(res: Response, status: number = 200) {
    res.status(status).json({
      message: this._message,
      data: this._data,
    })
  }

  unauthorized(res: Response, status: number = 401) {
    res.status(status).json({
      message: this._message,
      data: this._data,
    })
  }

  redirect(res: Response, url: string) {
    res.status(302).redirect(url);
  }
}
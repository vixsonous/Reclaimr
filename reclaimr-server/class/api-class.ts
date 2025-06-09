export class ApiResponse<T> {
  message: string = '';
  data: T | null = null;
  success: boolean = true;
  constructor(message: string, data: T | null, success: boolean) {
    this.message = message;
    this.data = data;
    this.success = success;
  }
}
export class ApiResponse<T = any> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: T;
  public readonly timestamp: string;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
    this.timestamp = new Date().toISOString();
  }

  public static success<T>(data: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  public static error(message = 'An error occurred', data?: any): ApiResponse {
    return new ApiResponse(false, message, data);
  }
}

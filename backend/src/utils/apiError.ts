import { HTTP_STATUS } from '../constants';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: any[];

  constructor(
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: string = 'Internal Server Error',
    errors?: any[],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string, errors?: any[]): ApiError {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  public static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  public static conflict(message: string): ApiError {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  public static internal(message = 'Internal server error'): ApiError {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, undefined, false);
  }
}

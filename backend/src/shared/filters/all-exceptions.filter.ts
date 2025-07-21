import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

type ErrorResponseBody =
  | { errors: Array<{ field?: string; message: string }> }
  | { message: string | string[] }
  | string;

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errors: Array<{ field?: string; message: string }> = [];

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse() as ErrorResponseBody;

      if (
        typeof responseBody === 'object' &&
        responseBody !== null &&
        'errors' in responseBody
      ) {
        const errs = (
          responseBody as { errors: Array<{ field?: string; message: string }> }
        ).errors;
        if (Array.isArray(errs)) {
          errors = errs;
        }
      } else if (
        typeof responseBody === 'object' &&
        responseBody !== null &&
        'message' in responseBody
      ) {
        const msg = (responseBody as { message: string | string[] }).message;
        if (Array.isArray(msg)) {
          errors = msg.map((m) => ({ message: m }));
        } else {
          errors = [{ message: msg }];
        }
      } else if (typeof responseBody === 'string') {
        errors = [{ message: responseBody }];
      } else {
        errors = [{ message: 'Unexpected error' }];
      }
    } else if (exception instanceof Error) {
      errors = [{ message: exception.message }];
    } else {
      errors = [{ message: 'Unknown error occurred' }];
    }

    response.status(status).json({
      statusCode: status,
      errors,
    });
  }
}

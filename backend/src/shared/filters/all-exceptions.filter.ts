import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errors: { field?: string; message: string }[];

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();

      if (
        typeof responseBody === 'object' &&
        responseBody !== null &&
        'message' in responseBody
      ) {
        const message: string | string[] = (
          responseBody as { message: string | string[] }
        ).message;

        if (Array.isArray(message)) {
          errors = message.map((msg) => ({ message: String(msg) }));
        } else {
          errors = [{ message }];
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

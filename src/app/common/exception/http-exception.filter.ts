import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    response.status(status).json({
      message:
        typeof message === 'string'
          ? message
          : message && typeof message === 'object' && 'message' in message
            ? message['message']
            : 'An unexpected error occurred',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

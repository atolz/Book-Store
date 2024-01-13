/* eslint-disable prettier/prettier */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
// import { ValidationError } from 'class-validator';
import {
  // Request,
  Response,
} from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(
      'exceptionis',
      exception?.response,
      exception,
      Object(exception).constraint,
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal Server Error';
    const status: boolean = false;

    if (exception instanceof HttpException) {
      // Handle HTTP exceptions
      statusCode = exception.getStatus();
      message = exception.getResponse();
      console.log('in error instance of Error', exception, message, statusCode);

      if (message instanceof Object) {
        return response.status(statusCode).json({
          status,
          statusCode,
          ...message,
        });
      }
      return response.status(statusCode).json({
        message,
        status,
        statusCode,
      });
    } else if (exception instanceof QueryFailedError) {
      // Handle validation errors
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      // const errorMsg = exception?.message?.match(/"([^"]+)"/);
      // message = errorMsg ? errorMsg[1] : exception?.message;
      message = Object(exception)?.constraint || exception?.message;
    } else if (exception instanceof Error && exception.message) {
      // Handle other generic errors
      console.log('Instance of Error....', exception);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    response.status(statusCode).json({
      message: message,
      status: status,
      statusCode: statusCode,

      //   timestamp: new Date().toISOString(),
      //   path: request.url,
    });
  }
}

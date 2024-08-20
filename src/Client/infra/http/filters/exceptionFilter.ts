import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import WrongValueError from 'src/Shared/errors/wrongValue';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;

    if (exception instanceof HttpException) status = exception.getStatus();
    if (exception instanceof NotFoundCustomError) status = HttpStatus.NOT_FOUND;
    if (
      exception instanceof AlreadyCreatedError ||
      exception instanceof WrongValueError
    )
      status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}

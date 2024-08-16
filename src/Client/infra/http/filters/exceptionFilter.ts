import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import AlreadyCreatedError from 'src/Client/application/errors/alreadyCreated';
import NotFoundCustomError from 'src/Client/application/errors/notFound';
import WrongValueError from 'src/Client/application/errors/wrongValue';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof NotFoundCustomError) status = HttpStatus.NOT_FOUND;
    if (
      exception instanceof AlreadyCreatedError ||
      exception instanceof WrongValueError
    )
      status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}

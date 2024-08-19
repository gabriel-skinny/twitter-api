import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class BetwenNumberPipe implements PipeTransform {
  constructor(
    private min: number,
    private max: number,
  ) {}

  transform(value: number, metadata: ArgumentMetadata) {
    if (!value) return;

    if (Number.isNaN(Number(value)))
      throw new HttpException(
        `${metadata.data} has to be a number`,
        HttpStatus.BAD_REQUEST,
      );

    if (value > this.max || this.min <= 0)
      throw new HttpException(
        `${metadata.data} has less than ${this.max} and more than or equal to ${this.min}`,
        HttpStatus.BAD_REQUEST,
      );
  }
}

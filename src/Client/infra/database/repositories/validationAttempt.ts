import { Injectable } from '@nestjs/common';
import { ValidationAttempt } from 'src/Client/application/entities/Validation/ValidationAttempt';
import AbstractValidationAttemptRepository from 'src/Client/application/repositories/validationAttempt/validationAttempt';

@Injectable()
export default class ValidationAttemptRepository
  implements AbstractValidationAttemptRepository
{
  save(validationAttempt: ValidationAttempt): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByValidationId(validationId: string): Promise<ValidationAttempt | null> {
    throw new Error('Method not implemented.');
  }
}

import { Injectable } from '@nestjs/common';
import {
  Validation,
  OperationToValidateTypeEnum,
} from 'src/Client/application/entities/Validation/Validation';
import AbstractValidationRepository from 'src/Client/application/repositories/validation/validationRepository';

@Injectable()
export default class ValidationRepository
  implements AbstractValidationRepository
{
  save(validation: Validation): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<Validation | null> {
    throw new Error('Method not implemented.');
  }
  findByEmailAndOperation(data: {
    email: string;
    operationToValidateType: OperationToValidateTypeEnum;
  }): Promise<Validation | null> {
    throw new Error('Method not implemented.');
  }
  delete(validation: Validation): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

import AbstractEmailProvider from 'src/Client/application/services/emailService';
import {
  OperationToValidateTypeEnum,
  Validation,
} from '../../../entities/Validation/Validation';
import { ValidationCode } from '../../../entities/Validation/ValidationCode';
import AbstractValidationRepository from '../../../repositories/validation/validationRepository';
import { Injectable } from '@nestjs/common';
import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';

export interface ICreateValidationCodeParams {
  email: string;
  operationToValidateType: OperationToValidateTypeEnum;
}

export abstract class AbstractCreateValidationCodeUseCase {
  abstract execute(data: ICreateValidationCodeParams): Promise<Validation>;
}

@Injectable()
export class CreateValidationCodeUseCase
  implements AbstractCreateValidationCodeUseCase
{
  constructor(
    private readonly validationRepository: AbstractValidationRepository,
    private readonly emailService: AbstractEmailProvider,
  ) {}

  async execute({
    email,
    operationToValidateType,
  }: ICreateValidationCodeParams) {
    const validationFounded =
      await this.validationRepository.findByEmailAndOperation({
        email,
        operationToValidateType,
      });
    if (validationFounded) throw new AlreadyCreatedError('Validation');

    const validation = new Validation({
      email,
      validationCode: new ValidationCode(),
      operationToValidateType,
    });
    await this.validationRepository.save(validation);

    await this.emailService.sendEmail({
      destinyEmail: email,
      emailType: 'emailConfirmation',
      content: `Send this validation code: ${validation.validationCode.value}`,
    });

    return validation;
  }
}

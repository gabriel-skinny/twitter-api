import AbstractEmailProvider from 'src/Client/application/services/emailService';
import {
  OperationToValidateTypeEnum,
  Validation,
} from '../../../entities/Validation/Validation';
import { ValidationCode } from '../../../entities/Validation/ValidationCode';
import AbstractValidationRepository from '../../../repositories/validation/validationRepository';

export interface ICreateValidationCodeParams {
  email: string;
  operationToValidateType: OperationToValidateTypeEnum;
}

export abstract class AbstractCreateValidationCodeUseCase {
  abstract execute(data: ICreateValidationCodeParams): Promise<Validation>;
}

export class CreateValidationCodeUseCase extends AbstractCreateValidationCodeUseCase {
  constructor(
    private readonly validationRepository: AbstractValidationRepository,
    private readonly emailService: AbstractEmailProvider,
  ) {
    super();
  }

  async execute({
    email,
    operationToValidateType,
  }: ICreateValidationCodeParams) {
    const emailValidationFounded =
      await this.validationRepository.findByEmailAndOperation({
        email,
        operationToValidateType,
      });

    if (emailValidationFounded)
      throw new Error('Email validation type already exists for that user');

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

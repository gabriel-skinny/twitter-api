import { Injectable } from '@nestjs/common';
import { OperationToValidateTypeEnum } from '../../../entities/Validation/Validation';
import AbstractValidationRepository from '../../../repositories/validation/validationRepository';
import {
  AbstractAuthService,
  TokenTypeEnum,
} from '../../../services/AuthService';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import WrongValueError from 'src/Shared/errors/wrongValue';

interface IValidateCodeUseCaseParams {
  email: string;
  validationCode: number;
  operationToValidateType: OperationToValidateTypeEnum;
  id: string;
}

interface IValidateCodeUseCaseReturn {
  jwtToken: string;
}

@Injectable()
export default class ValidateCodeUseCase {
  constructor(
    private readonly validationRepository: AbstractValidationRepository,
    private readonly authService: AbstractAuthService,
  ) {}

  async execute({
    email,
    validationCode,
    operationToValidateType,
    id,
  }: IValidateCodeUseCaseParams): Promise<IValidateCodeUseCaseReturn> {
    const validation = await this.validationRepository.findByEmailAndOperation({
      email,
      operationToValidateType,
    });

    if (!validation) throw new NotFoundCustomError('Validation');

    if (validation.validationCode.value != validationCode)
      throw new WrongValueError('ValidationCode');

    let jwtToken: string;
    switch (operationToValidateType) {
      case OperationToValidateTypeEnum.EMAIL_CONFIRMATION: {
        jwtToken = await this.authService.makeToken({
          tokenType: TokenTypeEnum.EMAIL_CONFIRMATION,
          id,
        });
        break;
      }
      case OperationToValidateTypeEnum.PASSWORD_CHANGE: {
        jwtToken = await this.authService.makeToken({
          tokenType: TokenTypeEnum.PASSWORD_CHANGE,
          id,
        });
        break;
      }

      default:
        throw new Error('Unkown operationToValidateType');
    }

    await this.validationRepository.delete(validation.id);

    return { jwtToken };
  }
}

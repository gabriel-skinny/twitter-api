import { Injectable } from '@nestjs/common';
import { OperationToValidateTypeEnum } from 'src/Client/application/entities/Validation/Validation';
import NotFoundCustomError from 'src/Client/application/errors/notFound';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';
import { AbstractCreateValidationCodeUseCase } from '../../code-validation/create/create-validation-code';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly createValidationUseCase: AbstractCreateValidationCodeUseCase,
  ) {}

  async execute(userEmail: string) {
    if (!(await this.userRepository.existsByEmail(userEmail)))
      throw new NotFoundCustomError('user');

    await this.createValidationUseCase.execute({
      email: userEmail,
      operationToValidateType: OperationToValidateTypeEnum.PASSWORD_CHANGE,
    });
  }
}

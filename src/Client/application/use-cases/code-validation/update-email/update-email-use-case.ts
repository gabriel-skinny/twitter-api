import { OperationToValidateTypeEnum } from 'src/Client/application/entities/Validation/Validation';
import AbstractValidationRepository from '../../../repositories/validation/validationRepository';
import { Injectable } from '@nestjs/common';

export interface IUpdateEmailCodeValidationUseCaseParams {
  newEmail: string;
  oldEmail: string;
  operationToValidateType: OperationToValidateTypeEnum;
}

export abstract class AbstractUpdateEmailCodeValidationUseCase {
  abstract execute(
    data: IUpdateEmailCodeValidationUseCaseParams,
  ): Promise<void>;
}

@Injectable()
export class UpdateEmailCodeValidationUseCase extends AbstractUpdateEmailCodeValidationUseCase {
  constructor(
    private readonly validationRepository: AbstractValidationRepository,
  ) {
    super();
  }

  async execute({
    newEmail,
    oldEmail,
    operationToValidateType,
  }: IUpdateEmailCodeValidationUseCaseParams) {
    const validation = await this.validationRepository.findByEmailAndOperation({
      email: oldEmail,
      operationToValidateType,
    });

    if (!validation)
      throw new Error('That validation does not exists for that email');

    validation.email = newEmail;
    await this.validationRepository.updateById({
      id: validation.id,
      data: validation,
    });
  }
}

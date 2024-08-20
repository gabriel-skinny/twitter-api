import { Injectable } from '@nestjs/common';
import { Password } from 'src/Client/application/entities/User/Password';
import PreUser from 'src/Client/application/entities/User/preUser';
import { OperationToValidateTypeEnum } from 'src/Client/application/entities/Validation/Validation';
import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';
import AbstractPreUserRepository from 'src/Client/application/repositories/preUser/preUserRepository';
import AbstractUserRepository from '../../../repositories/user/userRepository';
import { AbstractCreateValidationCodeUseCase } from '../../code-validation/create/create-validation-code';

interface IDataProps {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class StartAccountUseCase {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly preUserRepository: AbstractPreUserRepository,
    private readonly createValidationCodeUseCase: AbstractCreateValidationCodeUseCase,
  ) {}

  async execute(data: IDataProps): Promise<{ preUserId: string }> {
    if (await this.userRepository.existsByEmail(data.email))
      throw new AlreadyCreatedError('user');
    if (await this.userRepository.existsByName(data.name))
      throw new AlreadyCreatedError('user');
    if (await this.preUserRepository.existsByName(data.name))
      throw new AlreadyCreatedError('preUser');

    if (await this.preUserRepository.existsByEmail(data.email)) {
      await this.preUserRepository.deleteByEmail(data.email);
    }

    const preUser = new PreUser({
      name: data.name,
      email: data.email,
      password_hash: new Password(data.password),
    });
    await this.preUserRepository.save(preUser);

    await this.createValidationCodeUseCase.execute({
      email: data.email,
      operationToValidateType: OperationToValidateTypeEnum.EMAIL_CONFIRMATION,
    });

    return { preUserId: preUser.id };
  }
}

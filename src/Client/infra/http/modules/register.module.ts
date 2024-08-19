import { DatabaseModule } from '@infra/database/database.module';
import AuthService from '@infra/services/authService';
import { ServiceModule } from '@infra/services/service.module';
import { Module } from '@nestjs/common';
import { AbstractAuthService } from 'src/Client/application/services/AuthService';
import {
  AbstractCreateValidationCodeUseCase,
  CreateValidationCodeUseCase,
} from 'src/Client/application/use-cases/code-validation/create/create-validation-code';
import {
  AbstractUpdateEmailCodeValidationUseCase,
  UpdateEmailCodeValidationUseCase,
} from 'src/Client/application/use-cases/code-validation/update-email/update-email-use-case';
import CreateAccountUseCase from 'src/Client/application/use-cases/register/createAccount/create-account-use-case';
import { StartAccountUseCase } from 'src/Client/application/use-cases/register/startAccount/start-account-use-case';
import { UpdatePreUserEmailUseCase } from 'src/Client/application/use-cases/register/updatePreUserEmail/update-preUser-email-use-case';
import { RegisterController } from '../controllers/register';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    CreateAccountUseCase,
    StartAccountUseCase,
    UpdatePreUserEmailUseCase,
    {
      provide: AbstractAuthService,
      useClass: AuthService,
    },
    {
      provide: AbstractUpdateEmailCodeValidationUseCase,
      useClass: UpdateEmailCodeValidationUseCase,
    },
    {
      provide: AbstractCreateValidationCodeUseCase,
      useClass: CreateValidationCodeUseCase,
    },
  ],
  controllers: [RegisterController],
})
export default class RegisterModule {}

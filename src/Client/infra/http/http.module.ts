import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { DeleteAccountUseCase } from 'src/Client/application/use-cases/login-flow/deleteAccount/delete-account-use-case';
import { ForgotPasswordUseCase } from 'src/Client/application/use-cases/login-flow/forgotPassword/forgot-password-use-case';
import LoginUseCase from 'src/Client/application/use-cases/login-flow/login/login-use-case';
import LogoutUseCase from 'src/Client/application/use-cases/login-flow/logout/logout-use-case';
import { LogoutAllOtherSessionsUseCase } from 'src/Client/application/use-cases/login-flow/logoutAllOtherSessions/logout-all-other-sessions-use-case';
import UpdateAccountUseCase from 'src/Client/application/use-cases/login-flow/updateAccount/update-account-use-case';
import UpdatePasswordUseCase from 'src/Client/application/use-cases/login-flow/updatePassword/update-password-use-case';
import CreateAccountUseCase from 'src/Client/application/use-cases/register-flow/createAccount/create-account-use-case';
import { StartAccountUseCase } from 'src/Client/application/use-cases/register-flow/startAccount/start-account-use-case';
import { LoginController } from './controllers/login';
import { RegisterController } from './controllers/register';
import { ServiceModule } from '@infra/services/service.module';
import {
  AbstractCreateValidationCodeUseCase,
  CreateValidationCodeUseCase,
} from 'src/Client/application/use-cases/code-validation/create/create-validation-code';
import {
  AbstractUpdateEmailCodeValidationUseCase,
  UpdateEmailCodeValidationUseCase,
} from 'src/Client/application/use-cases/code-validation/update-email/update-email-use-case';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    CreateAccountUseCase,
    StartAccountUseCase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,
    ForgotPasswordUseCase,
    LoginUseCase,
    LogoutUseCase,
    LogoutAllOtherSessionsUseCase,
    UpdateAccountUseCase,
    UpdatePasswordUseCase,
    {
      provide: AbstractCreateValidationCodeUseCase,
      useClass: CreateValidationCodeUseCase,
    },
    {
      provide: AbstractUpdateEmailCodeValidationUseCase,
      useClass: UpdateEmailCodeValidationUseCase,
    },
  ],
  controllers: [LoginController, RegisterController],
})
export default class HttpModule {}

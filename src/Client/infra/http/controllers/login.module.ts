import { DatabaseModule } from '@infra/database/database.module';
import { ServiceModule } from '@infra/services/service.module';
import { Module } from '@nestjs/common';
import { DeleteAccountUseCase } from 'src/Client/application/use-cases/login-flow/deleteAccount/delete-account-use-case';
import { ForgotPasswordUseCase } from 'src/Client/application/use-cases/login-flow/forgotPassword/forgot-password-use-case';
import LoginUseCase from 'src/Client/application/use-cases/login-flow/login/login-use-case';
import LogoutUseCase, {
  AbstractLogoutUseCase,
} from 'src/Client/application/use-cases/login-flow/logout/logout-use-case';
import { LogoutAllOtherSessionsUseCase } from 'src/Client/application/use-cases/login-flow/logoutAllOtherSessions/logout-all-other-sessions-use-case';
import UpdateAccountUseCase from 'src/Client/application/use-cases/login-flow/updateAccount/update-account-use-case';
import UpdatePasswordUseCase from 'src/Client/application/use-cases/login-flow/updatePassword/update-password-use-case';
import { LoginController } from './login';
import {
  AbstractCreateValidationCodeUseCase,
  CreateValidationCodeUseCase,
} from 'src/Client/application/use-cases/code-validation/create/create-validation-code';

@Module({
  imports: [ServiceModule, DatabaseModule],
  providers: [
    DeleteAccountUseCase,
    ForgotPasswordUseCase,
    LoginUseCase,
    LogoutAllOtherSessionsUseCase,
    UpdateAccountUseCase,
    UpdatePasswordUseCase,
    {
      provide: AbstractLogoutUseCase,
      useClass: LogoutUseCase,
    },
    {
      provide: AbstractCreateValidationCodeUseCase,
      useClass: CreateValidationCodeUseCase,
    },
  ],
  controllers: [LoginController],
})
export default class LoginModule {}

import { DatabaseModule } from '@infra/database/database.module';
import { ServiceModule } from '@infra/services/service.module';
import { Module } from '@nestjs/common';
import { DeleteAccountUseCase } from 'src/Client/application/use-cases/user/delete/delete-account-use-case';
import { ForgotPasswordUseCase } from 'src/Client/application/use-cases/login/forgotPassword/forgot-password-use-case';
import LoginUseCase from 'src/Client/application/use-cases/login/login/login-use-case';
import LogoutUseCase, {
  AbstractLogoutUseCase,
} from 'src/Client/application/use-cases/login/logout/logout-use-case';
import { LogoutAllOtherSessionsUseCase } from 'src/Client/application/use-cases/login/logoutAllOtherSessions/logout-all-other-sessions-use-case';
import UpdateAccountUseCase from 'src/Client/application/use-cases/user/update/update-account-use-case';
import UpdatePasswordUseCase from 'src/Client/application/use-cases/user/updatePassword/update-password-use-case';

import {
  AbstractCreateValidationCodeUseCase,
  CreateValidationCodeUseCase,
} from 'src/Client/application/use-cases/code-validation/create/create-validation-code';
import { LoginController } from '../controllers/login';

@Module({
  imports: [ServiceModule, DatabaseModule],
  providers: [
    ForgotPasswordUseCase,
    LoginUseCase,
    LogoutAllOtherSessionsUseCase,
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

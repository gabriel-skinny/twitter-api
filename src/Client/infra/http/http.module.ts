import { DatabaseModule } from '@infra/database/database.module';
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
import { UpdatePreUserEmailUseCase } from 'src/Client/application/use-cases/register-flow/updatePreUserEmail/update-preUser-email-use-case';
import { CodeValidationController } from './controllers/codeValidation';
import { ResendValidationUseCase } from 'src/Client/application/use-cases/code-validation/resend/resend-validation-code';
import ValidateCodeUseCase from 'src/Client/application/use-cases/code-validation/validate/validate-code-use-case';
import { UploadController } from './controllers/upload';
import UploadMediaUseCase from 'src/Client/application/use-cases/upload-media/upload-media-use-case';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    CreateAccountUseCase,
    StartAccountUseCase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,
    ForgotPasswordUseCase,
    LoginUseCase,
    LogoutAllOtherSessionsUseCase,
    UpdateAccountUseCase,
    UpdatePasswordUseCase,
    UpdatePreUserEmailUseCase,
    ResendValidationUseCase,
    ValidateCodeUseCase,
    {
      provide: AbstractCreateValidationCodeUseCase,
      useClass: CreateValidationCodeUseCase,
    },
    {
      provide: AbstractUpdateEmailCodeValidationUseCase,
      useClass: UpdateEmailCodeValidationUseCase,
    },
    {
      provide: AbstractLogoutUseCase,
      useClass: LogoutUseCase,
    },
    UploadMediaUseCase,
  ],
  controllers: [
    LoginController,
    RegisterController,
    CodeValidationController,
    UploadController,
  ],
})
export default class HttpModule {}

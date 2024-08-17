import AuthService from '@infra/services/authService';
import { Module } from '@nestjs/common';
import { ResendValidationUseCase } from 'src/Client/application/use-cases/code-validation/resend/resend-validation-code';
import ValidateCodeUseCase from 'src/Client/application/use-cases/code-validation/validate/validate-code-use-case';
import { RegisterController } from './register';
import { ServiceModule } from '@infra/services/service.module';
import { DatabaseModule } from '@infra/database/database.module';

@Module({
  imports: [ServiceModule, DatabaseModule],
  providers: [ResendValidationUseCase, ValidateCodeUseCase],
  controllers: [RegisterController],
})
export default class CodeValidationModule {}

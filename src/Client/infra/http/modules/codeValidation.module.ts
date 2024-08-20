import { DatabaseModule } from '@infra/database/database.module';
import { ServiceModule } from '@infra/services/service.module';
import { Module } from '@nestjs/common';
import { ResendValidationUseCase } from 'src/Client/application/use-cases/code-validation/resend/resend-validation-code';
import ValidateCodeUseCase from 'src/Client/application/use-cases/code-validation/validate/validate-code-use-case';
import { CodeValidationController } from '../controllers/codeValidation';
import { CreateValidationCodeUseCase } from 'src/Client/application/use-cases/code-validation/create/create-validation-code';

@Module({
  imports: [ServiceModule, DatabaseModule],
  providers: [
    ResendValidationUseCase,
    ValidateCodeUseCase,
    CreateValidationCodeUseCase,
  ],
  controllers: [CodeValidationController],
})
export default class CodeValidationModule {}

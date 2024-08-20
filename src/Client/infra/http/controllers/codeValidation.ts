import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ResendValidationUseCase } from 'src/Client/application/use-cases/code-validation/resend/resend-validation-code';
import ValidateCodeUseCase from 'src/Client/application/use-cases/code-validation/validate/validate-code-use-case';
import {
  CreateCodeValidationDTO,
  ResendCodeValidationDTO,
  ValidateDTO,
} from '../dto/codeValidation';
import { BaseControllerMethodInterface } from '../interface/baseController';
import { CreateValidationCodeUseCase } from 'src/Client/application/use-cases/code-validation/create/create-validation-code';

@Controller('code-validation')
export class CodeValidationController {
  constructor(
    private readonly resendValidationCodeUseCase: ResendValidationUseCase,
    private readonly validateCodeUseCase: ValidateCodeUseCase,
    private readonly createValidationUseCase: CreateValidationCodeUseCase,
  ) {}

  @Post()
  async create(
    @Body() { email, operationToValidateType }: CreateCodeValidationDTO,
  ): Promise<BaseControllerMethodInterface> {
    await this.createValidationUseCase.execute({
      email,
      operationToValidateType,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Validation created',
    };
  }

  @Post('resend')
  async resendCode(
    @Body() { email, operationToValidateType }: ResendCodeValidationDTO,
  ): Promise<BaseControllerMethodInterface> {
    await this.resendValidationCodeUseCase.execute({
      email,
      operationToValidateType,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Email resent',
    };
  }

  @Post('validate')
  async validate(
    @Body() { email, operationToValidateType, validationCode, id }: ValidateDTO,
  ): Promise<BaseControllerMethodInterface<{ jwtToken: string }>> {
    const { jwtToken } = await this.validateCodeUseCase.execute({
      email,
      operationToValidateType,
      validationCode,
      id,
    });

    return {
      message: 'Code validated',
      statusCode: HttpStatus.CREATED,
      data: { jwtToken },
    };
  }
}

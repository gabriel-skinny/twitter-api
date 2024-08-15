import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ResendValidationUseCase } from 'src/Client/application/use-cases/code-validation/resend/resend-validation-code';
import ValidateCodeUseCase from 'src/Client/application/use-cases/code-validation/validate/validate-code-use-case';
import { ResendCodeValidationDTO, ValidateDTO } from '../dto/codeValidation';
import { BaseControllerMethodInterface } from '../interface/baseController';

@Controller('code-validation')
export class CodeValidationController {
  constructor(
    private readonly resendValidationCodeUseCase: ResendValidationUseCase,
    private readonly validateCodeUseCase: ValidateCodeUseCase,
  ) {}

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
    @Body() { email, operationToValidateType, validationCode }: ValidateDTO,
  ): Promise<BaseControllerMethodInterface<{ jwtToken: string }>> {
    const { jwtToken } = await this.validateCodeUseCase.execute({
      email,
      operationToValidateType,
      validationCode,
    });

    return {
      message: 'Code validated',
      statusCode: HttpStatus.CREATED,
      data: { jwtToken },
    };
  }
}

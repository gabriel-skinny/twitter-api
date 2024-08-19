import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import CreateAccountUseCase from 'src/Client/application/use-cases/register/createAccount/create-account-use-case';
import { StartAccountUseCase } from 'src/Client/application/use-cases/register/startAccount/start-account-use-case';
import { UpdatePreUserEmailUseCase } from 'src/Client/application/use-cases/register/updatePreUserEmail/update-preUser-email-use-case';
import { CreateUserDto, UpdateUserEmailDTO } from '../dto/user';
import { BaseControllerMethodInterface } from '../interface/baseController';
import { AuthenticationGuard } from '../guards/authenticationGuard';
import { AuthenticationTypeDecoretor } from '../decoretors/authenticationType';
import { TokenTypeEnum } from 'src/Client/application/services/AuthService';

@Controller('register')
export class RegisterController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly startAccountUseCase: StartAccountUseCase,
    private readonly updatePreUserEmailUseCase: UpdatePreUserEmailUseCase,
  ) {}

  @Post('create-account/:id')
  @UseGuards(AuthenticationGuard)
  @AuthenticationTypeDecoretor(TokenTypeEnum.EMAIL_CONFIRMATION)
  async createAccount(
    @Param('id', ParseUUIDPipe) preUserId: string,
  ): Promise<BaseControllerMethodInterface<{ loginToken: string }>> {
    const { loginToken } = await this.createAccountUseCase.execute(preUserId);

    return {
      statusCode: HttpStatus.CREATED,
      data: { loginToken },
      message: 'Account created',
    };
  }

  @Post('start-account')
  async startAccount(
    @Body() { email, name, password }: CreateUserDto,
  ): Promise<BaseControllerMethodInterface<{ preUserId: string }>> {
    const { preUserId } = await this.startAccountUseCase.execute({
      email,
      name,
      password,
    });

    return {
      message: 'Account started',
      statusCode: HttpStatus.CREATED,
      data: { preUserId },
    };
  }

  @Patch('update-validation-email/:id')
  async updateValidationEmail(
    @Param('id', ParseUUIDPipe) preUserId: string,
    @Body() { newEmail }: UpdateUserEmailDTO,
  ): Promise<BaseControllerMethodInterface> {
    await this.updatePreUserEmailUseCase.execute({ preUserId, newEmail });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Updated email sucessfully',
    };
  }
}

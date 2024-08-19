import {
  Body,
  Controller,
  HttpStatus,
  Ip,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TokenTypeEnum } from 'src/Client/application/services/AuthService';
import { ForgotPasswordUseCase } from 'src/Client/application/use-cases/login/forgotPassword/forgot-password-use-case';
import LoginUseCase from 'src/Client/application/use-cases/login/login/login-use-case';
import { AbstractLogoutUseCase } from 'src/Client/application/use-cases/login/logout/logout-use-case';
import { LogoutAllOtherSessionsUseCase } from 'src/Client/application/use-cases/login/logoutAllOtherSessions/logout-all-other-sessions-use-case';
import { AuthenticationTypeDecoretor } from '../decoretors/authenticationType';
import { ForgotPasswordDTO, LoginDTO } from '../dto/login';
import { AuthenticationGuard } from '../guards/authenticationGuard';
import { BaseControllerMethodInterface } from '../interface/baseController';

@Controller('login')
export class LoginController {
  constructor(
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: AbstractLogoutUseCase,
    private readonly logoutAllOtherSessionsUseCase: LogoutAllOtherSessionsUseCase,
  ) {}

  @Post('forgot-password')
  async forgotPassword(
    @Body() { email }: ForgotPasswordDTO,
  ): Promise<BaseControllerMethodInterface> {
    await this.forgotPasswordUseCase.execute(email);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Forgot password Email sent to user',
    };
  }

  @Post()
  async login(
    @Body() { email, password, deviceType }: LoginDTO,
    @Ip() ip: string,
  ): Promise<BaseControllerMethodInterface<{ loginToken: string }>> {
    const { loginToken } = await this.loginUseCase.execute({
      email,
      password,
      ip,
      deviceType,
    });

    return {
      statusCode: HttpStatus.CREATED,
      data: { loginToken },
      message: 'User session created',
    };
  }

  @Post('logout/:id')
  @UseGuards(AuthenticationGuard)
  @AuthenticationTypeDecoretor(TokenTypeEnum.LOGIN)
  async logout(
    @Param('id', ParseUUIDPipe) userId: string,
    @Ip() ip: string,
  ): Promise<BaseControllerMethodInterface> {
    await this.logoutUseCase.execute({
      userId,
      ip,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Logout made',
    };
  }

  @Post('logout-all-other-sessions/:id')
  @UseGuards(AuthenticationGuard)
  @AuthenticationTypeDecoretor(TokenTypeEnum.LOGIN)
  async logoutAllOtherSessions(
    @Param('id', ParseUUIDPipe) userId: string,
    @Ip() ip: string,
  ): Promise<BaseControllerMethodInterface> {
    await this.logoutAllOtherSessionsUseCase.execute({
      userId,
      actualIp: ip,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Logout made for all sessions',
    };
  }
}

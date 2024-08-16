import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Ip,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SessionDeviceTypesEnum } from 'src/Client/application/entities/User/Session';
import { DeleteAccountUseCase } from 'src/Client/application/use-cases/login-flow/deleteAccount/delete-account-use-case';
import { ForgotPasswordUseCase } from 'src/Client/application/use-cases/login-flow/forgotPassword/forgot-password-use-case';
import LoginUseCase from 'src/Client/application/use-cases/login-flow/login/login-use-case';
import { AbstractLogoutUseCase } from 'src/Client/application/use-cases/login-flow/logout/logout-use-case';
import { LogoutAllOtherSessionsUseCase } from 'src/Client/application/use-cases/login-flow/logoutAllOtherSessions/logout-all-other-sessions-use-case';
import UpdateAccountUseCase from 'src/Client/application/use-cases/login-flow/updateAccount/update-account-use-case';
import UpdatePasswordUseCase from 'src/Client/application/use-cases/login-flow/updatePassword/update-password-use-case';
import { UpdateUserDto } from '../dto/user';
import { BaseControllerMethodInterface } from '../interface/baseController';
import { ForgotPasswordDTO, LoginDTO, UpdatePasswordDTO } from '../dto/login';
import { AuthenticationGuard } from '../guards/authenticationGuard';
import {
  AuthenticationTypeDecoretor,
  IsPublicDecoretor,
} from '../decoretors/authenticationType';
import { TokenTypeEnum } from 'src/Client/application/services/AuthService';

@UseGuards(AuthenticationGuard)
@Controller('login')
export class LoginController {
  constructor(
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: AbstractLogoutUseCase,
    private readonly logoutAllOtherSessionsUseCase: LogoutAllOtherSessionsUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
  ) {}

  @Delete('user/:id')
  @AuthenticationTypeDecoretor(TokenTypeEnum.LOGIN)
  async deleteUser(
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<BaseControllerMethodInterface> {
    await this.deleteAccountUseCase.execute(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted',
    };
  }

  @Post('forgot-password')
  @IsPublicDecoretor()
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
  @IsPublicDecoretor()
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

  @Patch('update-user/:id')
  @AuthenticationTypeDecoretor(TokenTypeEnum.LOGIN)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UpdateUserDto,
  ): Promise<BaseControllerMethodInterface> {
    await this.updateAccountUseCase.execute({
      id,
      userData: user,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User updated',
    };
  }

  @Patch('update-password/:id')
  @AuthenticationTypeDecoretor(TokenTypeEnum.PASSWORD_CHANGE)
  async updatePassword(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() { newPassword }: UpdatePasswordDTO,
  ): Promise<BaseControllerMethodInterface> {
    await this.updatePasswordUseCase.execute({
      userId,
      newPassword,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password updated',
    };
  }
}

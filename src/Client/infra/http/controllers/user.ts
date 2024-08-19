import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TokenTypeEnum } from 'src/Client/application/services/AuthService';
import { DeleteAccountUseCase } from 'src/Client/application/use-cases/user/delete/delete-account-use-case';
import { FindUserUseCase } from 'src/Client/application/use-cases/user/find/find-user-use-case';
import { FindManyUsersUseCase } from 'src/Client/application/use-cases/user/findMany/find-many-users-use-case';
import UpdateAccountUseCase from 'src/Client/application/use-cases/user/update/update-account-use-case';
import UpdatePasswordUseCase from 'src/Client/application/use-cases/user/updatePassword/update-password-use-case';
import { AuthenticationTypeDecoretor } from '../decoretors/authenticationType';
import { UpdatePasswordDTO } from '../dto/login';
import { UpdateUserDto } from '../dto/user';
import { AuthenticationGuard } from '../guards/authenticationGuard';
import { BaseControllerMethodInterface } from '../interface/baseController';
import { BetwenNumberPipe } from '../pipes/perPage';
import { UserPaginationViewModel, UserViewModel } from '../view-models/user';

@UseGuards(AuthenticationGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly findUserUseCase: FindUserUseCase,
    private readonly findManyUsersUseCase: FindManyUsersUseCase,
  ) {}

  @Get(':id')
  @AuthenticationTypeDecoretor(TokenTypeEnum.LOGIN)
  async get(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseControllerMethodInterface<UserViewModel>> {
    const user = await this.findUserUseCase.execute(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'User found',
      data: new UserViewModel(user),
    };
  }

  @Get()
  @AuthenticationTypeDecoretor(TokenTypeEnum.LOGIN)
  async getMany(
    @Query('name') name?: string,
    @Query('perpage', new BetwenNumberPipe(0, 50)) perPage?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ): Promise<BaseControllerMethodInterface<UserPaginationViewModel>> {
    const { users, totalCount } = await this.findManyUsersUseCase.execute({
      filter: {
        name,
      },
      page,
      perPage,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Users found',
      data: new UserPaginationViewModel({
        users: users.map((user) => new UserViewModel(user)),
        page,
        perPage,
        total: totalCount,
      }),
    };
  }

  @Delete(':id')
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

  @Patch(':id')
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

  @Patch('password/:id')
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

import { DatabaseModule } from '@infra/database/database.module';
import { Module } from '@nestjs/common';
import { DeleteAccountUseCase } from 'src/Client/application/use-cases/user/delete/delete-account-use-case';
import { FindUserUseCase } from 'src/Client/application/use-cases/user/find/find-user-use-case';
import UpdateAccountUseCase from 'src/Client/application/use-cases/user/update/update-account-use-case';
import UpdatePasswordUseCase from 'src/Client/application/use-cases/user/updatePassword/update-password-use-case';
import { UserController } from '../controllers/user';
import { ServiceModule } from '@infra/services/service.module';
import { FindManyUsersUseCase } from 'src/Client/application/use-cases/user/findMany/find-many-users-use-case';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [
    UpdateAccountUseCase,
    UpdatePasswordUseCase,
    DeleteAccountUseCase,
    FindUserUseCase,
    FindManyUsersUseCase,
  ],
  controllers: [UserController],
})
export default class UserModule {}

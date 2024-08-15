import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './schemas/user';
import UserRepository from './repositories/userRepository';
import PreUserRepository from './repositories/preUserRepository';
import UserSessionRepository from './repositories/sessionRepository';
import ValidationRepository from './repositories/validationRepository';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';
import AbstractValidationRepository from 'src/Client/application/repositories/validation/validationRepository';
import AbstractUserSessionRepository from 'src/Client/application/repositories/session/sessionRepository';
import AbstractPreUserRepository from 'src/Client/application/repositories/preUser/preUserRepository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    {
      provide: AbstractPreUserRepository,
      useClass: PreUserRepository,
    },
    {
      provide: AbstractUserSessionRepository,
      useClass: UserSessionRepository,
    },
    {
      provide: AbstractValidationRepository,
      useClass: ValidationRepository,
    },
  ],
  exports: [
    AbstractUserRepository,
    AbstractPreUserRepository,
    AbstractUserSessionRepository,
    AbstractValidationRepository,
  ],
})
export class DatabaseModule {}

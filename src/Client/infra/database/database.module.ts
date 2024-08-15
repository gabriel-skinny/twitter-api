import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import AbstractPreUserRepository from 'src/Client/application/repositories/preUser/preUserRepository';
import AbstractUserSessionRepository from 'src/Client/application/repositories/session/sessionRepository';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';
import AbstractValidationRepository from 'src/Client/application/repositories/validation/validationRepository';
import { PreUserModel, PreUserSchema } from './mongodb/schemas/preUser';
import { UserModel, UserSchema } from './mongodb/schemas/user';
import {
  UserSessionModel,
  UserSessionSchema,
} from './mongodb/schemas/userSession';
import {
  ValidationModel,
  ValidationSchema,
} from './mongodb/schemas/validation';
import { AbstractCacheService, CacheService } from './redis/cacheService';
import RedisService from './redis/redis';
import PreUserRepository from './repositories/preUserRepository';
import UserSessionRepository from './repositories/sessionRepository';
import UserRepository from './repositories/userRepository';
import ValidationRepository from './repositories/validationRepository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
      {
        name: PreUserModel.name,
        schema: PreUserSchema,
      },
      {
        name: UserSessionModel.name,
        schema: UserSessionSchema,
      },
      {
        name: ValidationModel.name,
        schema: ValidationSchema,
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
    {
      provide: AbstractCacheService,
      useFactory: () => {
        return new CacheService(new RedisService());
      },
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

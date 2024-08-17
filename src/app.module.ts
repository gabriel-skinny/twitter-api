import { DatabaseModule } from '@infra/database/database.module';
import {
  PreUserModel,
  PreUserSchema,
} from '@infra/database/mongodb/schemas/preUser';
import { UserModel, UserSchema } from '@infra/database/mongodb/schemas/user';
import {
  UserSessionModel,
  UserSessionSchema,
} from '@infra/database/mongodb/schemas/userSession';
import {
  ValidationModel,
  ValidationSchema,
} from '@infra/database/mongodb/schemas/validation';
import HttpModule from '@infra/http/http.module';
import { ServiceModule } from '@infra/services/service.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

const mongoUrl = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DB_NAME}?authSource=admin`;

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 2525,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    HttpModule,
    MongooseModule.forRoot(mongoUrl),
    DatabaseModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AbstractAuthService } from 'src/Client/application/services/AuthService';
import AbstractEmailService from 'src/Client/application/services/emailService';
import AbstractFileStorageService from 'src/Client/application/services/FileStorageService';
import AuthService, { AbstractGenericAuthProvider } from './authService';
import EmailService from './emailService';
import FileStorageService from './fileStorageService';
import { JwtModule, JwtService } from '@nestjs/jwt';
import 'dotenv/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  providers: [
    {
      provide: AbstractAuthService,
      useClass: AuthService,
    },
    {
      provide: AbstractEmailService,
      useClass: EmailService,
    },
    {
      provide: AbstractFileStorageService,
      useClass: FileStorageService,
    },
  ],
  exports: [
    AbstractAuthService,
    AbstractEmailService,
    AbstractFileStorageService,
  ],
})
export class ServiceModule {}

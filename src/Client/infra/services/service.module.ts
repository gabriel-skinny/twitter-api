import { Module } from '@nestjs/common';
import { AbstractAuthService } from 'src/Client/application/services/AuthService';
import AbstractEmailService from 'src/Client/application/services/emailService';
import AbstractFileStorageService from 'src/Client/application/services/FileStorageService';
import AuthService from './authService';
import EmailService from './emailService';
import FileStorageService from './fileStorageService';

@Module({
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

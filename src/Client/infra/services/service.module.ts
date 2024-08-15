import { Module } from '@nestjs/common';
import { AbstractAuthService } from 'src/Client/application/services/AuthService';
import AuthService from './authService';
import AbstractEmailService from 'src/Client/application/services/emailService';
import EmailService from './emailService';
import AbstractFileStorageService from 'src/Client/application/services/FileStorageService';
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

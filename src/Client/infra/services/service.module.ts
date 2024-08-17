import { Module } from '@nestjs/common';
import 'dotenv/config';
import { AbstractAuthService } from 'src/Client/application/services/AuthService';
import AbstractEmailService from 'src/Client/application/services/emailService';
import AbstractFileStorageService from 'src/Client/application/services/FileStorageService';
import AuthService from './authService';
import EmailService from './emailService';
import FileStorageService from './fileStorageService';
import S3StorageProvider from './s3Provider';

@Module({
  imports: [],
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
      useFactory: () =>
        new FileStorageService(
          new S3StorageProvider(process.env.AWS_S3_BUCKET_NAME),
        ),
    },
  ],
  exports: [
    AbstractAuthService,
    AbstractEmailService,
    AbstractFileStorageService,
  ],
})
export class ServiceModule {}

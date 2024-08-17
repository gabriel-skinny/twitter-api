import { Module } from '@nestjs/common';
import UploadModule from './controllers/upload.module';
import RegisterModule from './controllers/register.module';
import LoginModule from './controllers/login.module';
import CodeValidationModule from './controllers/codeValidation.module';

@Module({
  imports: [UploadModule, RegisterModule, LoginModule, CodeValidationModule],
  providers: [],
})
export default class HttpModule {}

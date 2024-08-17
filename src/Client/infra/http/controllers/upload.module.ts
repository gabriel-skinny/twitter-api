import { ServiceModule } from '@infra/services/service.module';
import { Module } from '@nestjs/common';
import UploadMediaUseCase from 'src/Client/application/use-cases/upload-media/upload-media-use-case';
import { UploadController } from './upload';

@Module({
  imports: [ServiceModule],
  providers: [UploadMediaUseCase],
  controllers: [UploadController],
})
export default class UploadModule {}

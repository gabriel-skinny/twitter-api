import {
  Body,
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import UploadMediaUseCase from 'src/Client/application/use-cases/upload-media/upload-media-use-case';
import UploadMediaDTO from '../dto/upload';
import { BaseControllerMethodInterface } from '../interface/baseController';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadMediaUseCase: UploadMediaUseCase) {}

  @Post('media')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
    @Body() { media_type }: UploadMediaDTO,
  ): Promise<BaseControllerMethodInterface<{ fileUrl: string }>> {
    const { url } = await this.uploadMediaUseCase.execute({
      media: file.buffer,
      mediaType: media_type,
      mimeType: file.mimetype,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Media uploaded',
      data: { fileUrl: url },
    };
  }
}

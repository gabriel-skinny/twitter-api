import { IsEnum, IsNotEmpty } from 'class-validator';
import { MediaTypeEnum } from 'src/Client/application/use-cases/upload-media/upload-media-use-case';

export default class UploadMediaDTO {
  @IsNotEmpty()
  @IsEnum(MediaTypeEnum)
  media_type: MediaTypeEnum;
}

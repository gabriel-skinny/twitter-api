import { Injectable } from '@nestjs/common';
import AbstractFileStorageService from '../../services/FileStorageService';

export enum MediaTypeEnum {
  PROFILE_PICTURE = 'profile_picture',
  BANNER_IMAGE = 'banner_image',
}

interface IParamsUploadMedia {
  media: Buffer;
  mediaType: MediaTypeEnum;
  mimeType: string;
}

@Injectable()
export default class UploadMediaUseCase {
  constructor(
    private readonly fileStorageService: AbstractFileStorageService,
  ) {}

  async execute({
    media,
    mediaType,
    mimeType,
  }: IParamsUploadMedia): Promise<{ url: string }> {
    const { url } = await this.fileStorageService.upload({
      file: media,
      mediaType,
      mimeType,
    });

    return { url };
  }
}

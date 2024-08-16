import { Injectable } from '@nestjs/common';
import AbstractFileStorageService from 'src/Client/application/services/FileStorageService';
import { AbstractGenericStorageProvider } from './s3Provider';
import { MediaTypeEnum } from 'src/Client/application/use-cases/upload-media/upload-media-use-case';

export interface IFileStorageUploadParams {
  mediaType: MediaTypeEnum;
  file: Buffer;
  mimeType: string;
}

@Injectable()
export default class FileStorageService implements AbstractFileStorageService {
  constructor(private storageProvider: AbstractGenericStorageProvider) {}

  async upload({
    file,
    mimeType,
    mediaType,
  }: IFileStorageUploadParams): Promise<{ url: string }> {
    const path = `${mediaType}/image_${Date.now()}.${mimeType.split('/')[1]}`;

    return this.storageProvider.upload({
      file,
      mimeType,
      key: path,
    });
  }
}

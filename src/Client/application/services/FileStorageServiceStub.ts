import { IFileStorageUploadParams } from '@infra/services/fileStorageService';
import AbstractFileStorageService from './FileStorageService';

export class FileStorageServiceStub extends AbstractFileStorageService {
  async upload(data: IFileStorageUploadParams): Promise<{ url: string }> {
    return { url: 'http://filestorage.com' };
  }
}

import { IFileStorageUploadParams } from '@infra/services/fileStorageService';

export default abstract class AbstractFileStorageService {
  abstract upload(data: IFileStorageUploadParams): Promise<{ url: string }>;
}

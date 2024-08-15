import { Injectable } from '@nestjs/common';
import AbstractFileStorageService from 'src/Client/application/services/FileStorageService';

@Injectable()
export default class FileStorageService implements AbstractFileStorageService {
  upload(data: { path: string; file: Buffer }): Promise<{ url: string }> {
    throw new Error('Method not implemented.');
  }
}

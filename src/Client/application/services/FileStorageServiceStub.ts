import AbstractFileStorageService from "./FileStorageService";

export class FileStorageServiceStub extends AbstractFileStorageService {
    async upload(data: { path: string; file: Buffer; }): Promise<{ url: string; }> {
        return { url: "http://filestorage.com"} 
    }
    
}

export default abstract class AbstractFileStorageService {
    abstract upload(data: { path: string, file: Buffer }): Promise<{ url: string }>;
}
import FileStorageService from "../../services/FileStorageService";

export enum MediaTypeEnum {
    PROFILE_PICTURE = "profile_picture"
}

interface IParamsUploadMedia {
    media: Buffer;
    mediaName: string;
    mediaType: MediaTypeEnum;
}

export default class UploadMediaUseCase {
    constructor (
        private readonly fileStorageService: FileStorageService
    ) {}

    async execute({ media, mediaType, mediaName }: IParamsUploadMedia): Promise<{ url: string }> {
        const path = `${mediaType}/${Date.now()}_${mediaName}`;

        const { url } = await this.fileStorageService.upload({ path, file: media });
    
        return { url }
    }
}
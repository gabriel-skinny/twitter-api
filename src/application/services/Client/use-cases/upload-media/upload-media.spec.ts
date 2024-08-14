import { FileStorageServiceStub } from "../../services/FileStorageServiceStub";
import UploadMediaUseCase, { MediaTypeEnum } from "./upload-media-use-case";

describe("Upload media use case", () => {
    it ("should download to a file Storage and return the url", async () => {
        const fileStorage = new FileStorageServiceStub();
        const uploadMediaUseCase = new UploadMediaUseCase(fileStorage);

        const uploadUrlReturn = "http://uploadTeste";
        fileStorage.upload = jest.fn().mockReturnValue({ url: uploadUrlReturn})

        const { url } = await uploadMediaUseCase.execute({
            media: new Buffer("pictureData"),
            mediaName: "mediaName",
            mediaType: MediaTypeEnum.PROFILE_PICTURE
        });
    
        expect(url).toBeTruthy();
        expect(url).toBe(uploadUrlReturn);
    })
})
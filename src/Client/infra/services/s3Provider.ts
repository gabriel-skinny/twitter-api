import { S3 } from 'aws-sdk';
import 'dotenv/config';

interface IUploadParams {
  file: Buffer;
  key: string;
  mimeType: string;
}

export abstract class AbstractGenericStorageProvider {
  abstract upload(data: IUploadParams): Promise<{ url: string }>;
}

export default class S3StorageProvider
  implements AbstractGenericStorageProvider
{
  private readonly _s3Client: S3;
  private readonly _bucket: string;

  constructor(bucket: string) {
    this._s3Client = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
    this._bucket = bucket;
  }

  public async upload({ file, mimeType, key }: IUploadParams) {
    const response = await this._s3Client
      .upload({
        Bucket: this._bucket,
        Key: key,
        ContentType: mimeType,
        Body: file,
      })
      .promise();

    return { url: response.Location };
  }
}

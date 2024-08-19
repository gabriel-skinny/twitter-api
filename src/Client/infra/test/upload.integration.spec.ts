import UploadModule from '@infra/http/modules/upload.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('Upload controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UploadModule],
    }).compile();

    app = moduleRef.createNestApplication();
  });

  it('/login', () => {
    const exepectedSucessReturn = {
      statusCode: '201',
      message: 'Login sucessfully',
      data: { token: '' },
    };

    request(app.getHttpServer())
      .post('/login')
      .expect(201)
      .expect(exepectedSucessReturn);
  });

  afterAll(() => app.close());
});

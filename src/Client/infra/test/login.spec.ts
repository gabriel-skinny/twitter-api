import HttpModule from '@infra/http/http.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('login controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
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

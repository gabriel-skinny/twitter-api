import { DatabaseModule } from '@infra/database/database.module';
import HttpModule from '@infra/http/http.module';
import { ServiceModule } from '@infra/services/service.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb://localhost:27017'),
    DatabaseModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

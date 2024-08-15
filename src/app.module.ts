import { DatabaseModule } from '@infra/database/database.module';
import HttpModule from '@infra/http/http.module';
import { ServiceModule } from '@infra/services/service.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

const mongoUrl = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DB_NAME}?authSource=admin`;

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(mongoUrl),
    DatabaseModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URL_DEV)],
  exports: [MongooseModule],
})
export class DatabaseModule {}

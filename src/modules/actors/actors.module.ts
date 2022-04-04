import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActorsController } from './actors.controller';
import { ActorService } from './services/actors.service';
import { Actor, ActorSchema } from './schemas/actor.schema';
import { ActorRepository } from './repositories/actor.repository';
import { FaceapiModule } from '@modules/faceapi/faceapi.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImgUploadModule } from '@core/imageUploader/img-upload.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Actor.name, schema: ActorSchema }]),
    MulterModule.register({
      dest: './uploadFiles',
    }),
    FaceapiModule,
    ImgUploadModule,
    UserModule,
  ],
  controllers: [ActorsController],
  providers: [ActorService, ActorRepository],
  exports: [ActorService],
})
export class ActorsModule {}

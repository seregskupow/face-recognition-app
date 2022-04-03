import { Module } from '@nestjs/common';
import { FaceapiService } from './services/faceapi.service';
import { FaceapiController } from './faceapi.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploadFiles',
    }),
  ],
  providers: [FaceapiService],
  controllers: [FaceapiController],
  exports: [FaceapiService],
})
export class FaceapiModule {}

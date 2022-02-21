import { Module } from '@nestjs/common';
import { FaceapiService } from './faceapi.service';

@Module({
  providers: [FaceapiService]
})
export class FaceapiModule {}

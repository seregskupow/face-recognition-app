import { Module } from '@nestjs/common';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './services/recognition.service';

@Module({
  controllers: [RecognitionController],
  providers: [RecognitionService]
})
export class RecognitionModule {}

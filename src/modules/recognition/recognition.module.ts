import { Module } from '@nestjs/common';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './services/recognition.service';

@Module({
  controllers: [RecognitionController],
  providers: [RecognitionService],
	exports:[RecognitionService]
})
export class RecognitionModule {}

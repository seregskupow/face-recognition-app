import { Module } from '@nestjs/common';
import { ExternalApisService } from './services/services.service';
import { ExternalApisController } from './external-apis.controller';

@Module({
  providers: [ExternalApisService],
  controllers: [ExternalApisController],
})
export class ExternalApisModule {}

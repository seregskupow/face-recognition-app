import { Module } from '@nestjs/common';
import { providers } from './img-upload.providers';
import { ImgUploadService } from './img-upload.service';

@Module({
  providers: [ImgUploadService, ...providers],
  exports: [ImgUploadService],
})
export class ImgUploadModule {}

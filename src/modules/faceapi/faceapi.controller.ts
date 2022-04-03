import {
  Body,
  Controller,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FaceapiService } from './services/faceapi.service';

@Controller('faceapi')
export class FaceapiController {
  constructor(private readonly faceApiService: FaceapiService) {}

  @Post('reco')
  @UseInterceptors(FileInterceptor('file'))
  async recogniseFaces(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    return await this.faceApiService.recogniseFaces(file.path);
  }
}

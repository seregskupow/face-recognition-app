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
    const result: any = await this.faceApiService.recogniseFaces(file.path);
    return result;
    // try {
    //   // const result: any = await this.faceApiService.recogniseFaces(file.path);
    //   // res.writeHead(200, {
    //   //   'Content-Type': 'image/jpeg',
    //   //   'Content-Length': result.length,
    //   // });
    //   // res.end(result);
    // } catch (e) {
    //   throw new HttpException(
    //     { message: e.message },
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
  }
}

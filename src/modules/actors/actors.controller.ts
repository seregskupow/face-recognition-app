import { FaceapiService } from '@modules/faceapi/services/faceapi.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseActorsDto } from './dto/parseActors.dto';
import { ParseWikiActorsDto } from './dto/parseWikiActors.dto';
import { ActorService } from './services/actors.service';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorService: ActorService) {}

  @Get('/id/:id')
  async getActorById(@Param('id') id: string) {
    return await this.actorService.findOneById(id);
  }

  @Get('/name/:name')
  async getActorByName(@Param('name') name: string) {
    return await this.actorService.findOneByName(name);
  }

  @Post('getactors')
  async getActors(@Body() parseActorsDto: ParseActorsDto) {
    return await this.actorService.getActors(parseActorsDto.actorNames);
  }

  @Post('parsewikiactors')
  async parseWikiActors(@Body() parseWikiActorsDto: ParseWikiActorsDto) {
    return await this.actorService.parseWikiActors(
      parseWikiActorsDto.actorNames,
    );
  }

  //TODO: add authentication && save user history
  @Post('recognise')
  @UseInterceptors(FileInterceptor('file'))
  async recogniseFaces(@UploadedFile() file: Express.Multer.File) {
    return await this.actorService.recogniseActors(file.path);
  }
}

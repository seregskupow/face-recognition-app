import { AuthenticatedGuard } from '@core/guards/authenticated.guard';
import { NotFoundInterceptor } from '@core/interceptors/notFound.interceptor';
import { FaceapiService } from '@modules/faceapi/services/faceapi.service';
import { UserHistoryService } from '@modules/user/services/user-history.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseActorsDto } from './dto/parseActors.dto';
import { ParseWikiActorsDto } from './dto/parseWikiActors.dto';
import { ActorService } from './services/actors.service';

@Controller('actors')
export class ActorsController {
  constructor(
    private readonly actorService: ActorService,
    private readonly userHistoryService: UserHistoryService,
  ) {}

  @Get('id/:id')
  @UseInterceptors(new NotFoundInterceptor('No actor found for given id'))
  async getActorById(@Param('id') id: string) {
    return await this.actorService.findOneById(id);
  }

  @Get('name/:name')
  @UseInterceptors(new NotFoundInterceptor('No actor found for given name'))
  async getActorByName(@Param('name') name: string) {
    return await this.actorService.findOneByName(name);
  }

  @Post('getactors')
  async getActors(@Body() parseActorsDto: ParseActorsDto) {
    return await this.actorService.getActors(parseActorsDto.actorNames);
  }

  @Post('parsewikiactors')
  @UseGuards(AuthenticatedGuard)
  async parseWikiActors(@Body() parseWikiActorsDto: ParseWikiActorsDto) {
    return await this.actorService.parseWikiActors(
      parseWikiActorsDto.actorNames,
    );
  }

  //TODO: add authentication && save user history
  @Post('recognise')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(
    FileInterceptor('file'),
    new NotFoundInterceptor('Could not find faces'),
  )
  async recogniseFaces(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: SessionRequest,
  ) {
    const result = await this.actorService.recogniseActors(file.path);

    if (!result) return null;

    await this.userHistoryService.create({
      actors: result.names,
      owner: req.user._id,
    });
    return result;
  }
}

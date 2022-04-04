import { NotFoundInterceptor } from '@core/interceptors/notFound.interceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { OMDbDto } from './dto/omdb.dto';
import { ExternalApisService } from './services/services.service';

@Controller('external_apis')
export class ExternalApisController {
  constructor(private readonly externalAPIsServie: ExternalApisService) {}

  @Post('omdb_films')
  @UseInterceptors(
    new NotFoundInterceptor('Could not find data for provided films'),
  )
  async OMDbAPI(@Body() { filmNames }: OMDbDto) {
    return await this.externalAPIsServie.OMDbAPI(filmNames);
  }
}

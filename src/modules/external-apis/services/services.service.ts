import { Injectable } from '@nestjs/common';
import { OMDbResponseDto } from '../dto/omdb.dto';
import axios from 'axios';
import * as utf8 from 'utf8';

@Injectable()
export class ExternalApisService {
  async OMDbAPI(filmNames: string[]) {
    const filmData: OMDbResponseDto[] = [];

    for (let i = 0; i < filmNames.length; i++) {
      try {
        const { data } = await axios.get(
          `http://www.omdbapi.com/?t=${utf8.encode(filmNames[i])}&apikey=${
            process.env.OMDb_KEY
          }`,
        );
        if (data.Response === 'True') {
          filmData.push({
            title: data.Title,
            poster: data.Poster,
            year: data.Year,
            genre: data.Genre,
            director: data.Director,
            plot: data.Plot,
            boxOffice: data.BoxOffice,
            ageRating: data.Rated,
            releaseDate: data.Released,
            metascoreRating: data.Metascore === 'N/A' ? null : data.Metascore,
            imdbRating: data.imdbRating === 'N/A' ? null : data.imdbRating,
          });
        }
      } catch (e) {
        continue;
      }
    }

    if (!filmData.length) return null;
    return filmData;
  }
}

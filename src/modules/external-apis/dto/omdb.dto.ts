import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class OMDbDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  filmNames: string[];
}

export class OMDbResponseDto {
  title: string;
  year: string;
  ageRating: string;
  releaseDate: string;
  genre: string;
  director: string;
  plot: string;
  poster: string;
  metascoreRating: string;
  imdbRating: string;
  boxOffice: string;
}

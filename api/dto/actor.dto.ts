type FilmDto = {
  poster: string;

  link: string;

  title: string;
};

export class ActorDto {
  id: string;

  name: string;

  photo: string;

  birthDay: string;

  birthPlace: string;

  biography: string;

  films: FilmDto[];
}

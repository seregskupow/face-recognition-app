export class FilmDto {
  readonly poster: string;

  readonly link: string;

  readonly title: string;
}

export class ActorDto {
  readonly name: string;

  readonly photo: string;

  readonly birthDay: string;

  readonly birthPlace: string;

  readonly biography: string;

  readonly films: FilmDto[];
}

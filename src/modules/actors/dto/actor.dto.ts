export class FilmDto {
  poster: string;

  link: string;

  title: string;
}

export class ActorDto {
  constructor(
    name: string,
    photo: string,
    birthDay: string,
    birthPlace: string,
    biography: string,
    films: FilmDto[],
  ) {
    this.name = name;
    this.photo = photo;
    this.birthDay = birthDay;
    this.birthPlace = birthPlace;
    this.biography = biography;
    this.films = films;
  }

  name: string;

  photo: string;

  birthDay: string;

  birthPlace: string;

  biography: string;

  films: FilmDto[];
}

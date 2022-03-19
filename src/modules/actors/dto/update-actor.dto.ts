export class UpdateFilmDto {
  readonly poster?: string;

  readonly link?: string;

  readonly title?: string;
}

export class UpdateActorDto {
  readonly name?: string;

  readonly photo?: string;

  readonly birthDay?: string;

  readonly birthPlace?: string;

  readonly biography?: string;

  readonly films?: UpdateFilmDto[];
}

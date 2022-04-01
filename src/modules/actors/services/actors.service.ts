import {
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { parseOGMetatags } from '@utils/parseOG';
import { Model, Types } from 'mongoose';
import { Browser, Page } from 'puppeteer';
import {
  BIOGRAPHY,
  BIRTHDAY,
  BIRTHPLACE,
  FILMS_PARENT,
  FILM_LINK,
  FILM_POSTER,
  FILM_TITLE,
  PHOTO,
  ROTTEN_TOMATOES_URL,
  TEST_ELEM,
  UNAVAILABLE,
} from '../constants';
import { ActorDto, FilmDto } from '../dto/actor.dto';
import { UpdateActorDto } from '../dto/update-actor.dto';
import { ActorRepository } from '../repositories/actor.repository';
import { Actor, ActorDocument } from '../schemas/actor.schema';

@Injectable()
export class ActorService {
  private readonly logger = new Logger(ActorService.name);

  constructor(
    private readonly actorRepository: ActorRepository,
    @Inject('CHROMIUM_BROWSER') private browser: Browser,
  ) {}

  async create(actor: ActorDto): Promise<Actor> {
    return this.actorRepository.create(actor);
  }

  async update(id: string, oldActor: UpdateActorDto): Promise<Actor> {
    return this.actorRepository.update(id, oldActor);
  }

  delete(id: string) {
    return this.actorRepository.delete(id);
  }

  findOneById(id: string): Promise<Actor> {
    return this.actorRepository.findOneById(id);
  }

  findOneByName(name: string): Promise<Actor> {
    return this.actorRepository.findOneByName(name);
  }

  findAll(): Promise<Actor[]> {
    return this.actorRepository.findAll();
  }

  async parseWikiActors(names: string[]) {
    try {
      const baseUrl = 'https://en.wikipedia.org/wiki/';
      const wikiData = [];
      for (let i = 0; i < names.length; i++) {
        const link = baseUrl + names[i];
        const parsed: any = await parseOGMetatags(link);
        if (parsed.title && parsed.image)
          wikiData.push({
            photo: parsed.image,
            name: parsed.title.split('-')[0],
            link,
          });
      }
      return wikiData;
    } catch (e) {
      throw new NotImplementedException('Could not parse wikipedia');
    }
  }
  async getActors(names: string[]) {
    const actors: ActorDto[] = [];
    for (let i = 0; i < names.length; i++) {
      const actor = await this.parseSingleActor(names[i]);
    }
  }
  async parseSingleActor(nameToParse: string) {
    try {
      const actor: ActorDto = {
        name: nameToParse,
        photo: null,
        birthDay: null,
        birthPlace: null,
        biography: null,
        films: null,
      };
      //rottentomatoes.com has different actor name styles in their links("-" && "_" separators). so we have to check if page exists
      //TODO: try to remake this
      const nameBase = nameToParse
        .split(' ')
        .join('')
        .split(/(?=[A-Z])/);
      const nameUnderlines = nameBase.join('_').replace('.', '').toLowerCase();
      const nameDash = nameBase.join('-').replace('.', '').toLowerCase();

      const links: string[] = [nameUnderlines, nameDash];

      const page = await this.browser.newPage();

      for (let i = 0; i < links.length; i++) {
        const link = ROTTEN_TOMATOES_URL + links[i];
        await page.goto(link);
        this.logger.log('Navigating to: ' + link);

        const testElement = await page.$(TEST_ELEM);
        if (testElement) break;
        else this.logger.log('Link failed: ' + link);
      }

      const photoElement = await page.$(PHOTO);
      if (photoElement)
        actor.photo =
          (await (await photoElement.getProperty('src')).jsonValue()) || null;

      const birthDayElement = await page.$(BIRTHDAY);
      if (birthDayElement) {
        const birthDay = await birthDayElement.evaluate(
          (e) => e.textContent.trim() || null,
        );
        if (birthDay !== UNAVAILABLE)
          actor.birthDay = birthDay.replace('Birthday:\n', '').trim();
      }

      const birthPlaceElement = await page.$(BIRTHPLACE);
      if (birthPlaceElement) {
        const birthPlace = await birthPlaceElement.evaluate(
          (e) => e.textContent.trim() || null,
        );
        if (birthPlace !== UNAVAILABLE)
          actor.birthPlace = birthPlace.replace('Birthplace:\n', '').trim();
      }

      const biographyElement = await page.$(BIOGRAPHY);
      if (biographyElement) {
        const biography = await biographyElement.evaluate(
          (e) => e.textContent.trim() || null,
        );
        if (biography !== UNAVAILABLE) actor.biography = biography;
      }

      const filmsParent = await page.$$(FILMS_PARENT);

      const films: FilmDto[] = [];
      for (let i = 0; i < filmsParent.length; i++) {
        try {
          const film: FilmDto = {
            link: null,
            poster: null,
            title: null,
          };

          const titleElement = await filmsParent[i].$(FILM_TITLE);
          if (!titleElement) continue;
          film.title = await titleElement.evaluate(
            (e) => e.textContent.trim() || null,
          );

          const posterElement = await filmsParent[i].$(FILM_POSTER);
          if (!posterElement) continue;
          film.poster = await posterElement.evaluate(
            (e) => e.getAttribute('src') || null,
          );

          const linkElement = await filmsParent[i].$(FILM_LINK);
          if (!linkElement) continue;
          film.link = await linkElement.evaluate(
            (e) => e.getAttribute('href') || null,
          );

          films.push(film);
        } catch (e) {}
      }
      actor.films = films;

      await page.close();
      return actor;
    } catch (e) {
      //Bad practice, but parsing is unreliable and I cant be sure in 100% success rate
      return null;
    }
  }
}

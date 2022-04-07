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
import { of } from 'rxjs';
import * as moment from 'moment';

import {
  BIOGRAPHY,
  BIRTHDAY,
  BIRTHPLACE,
  FILMS_PARENT,
  FILM_LINK,
  FILM_POSTER,
  FILM_TITLE,
  PHOTO,
  ROTTEN_TOMATOES_CELEB_URL,
  ROTTEN_TOMATOES_URL,
  TEST_ELEM,
  UNAVAILABLE,
} from '../constants';
import { ActorDto, FilmDto } from '../dto/actor.dto';
import { UpdateActorDto } from '../dto/update-actor.dto';
import { ActorRepository } from '../repositories/actor.repository';
import { Actor, ActorDocument } from '../schemas/actor.schema';
import { FaceapiService } from '@modules/faceapi/services/faceapi.service';
import { ImgUploadService } from '@core/imageUploader/img-upload.service';

type recogniseActorsType = {
  names: string[];
  image: string;
};
type parsedWikiActor = {
  photo: string;
  name: string;
  link: string;
};

@Injectable()
export class ActorService {
  private readonly logger = new Logger(ActorService.name);

  constructor(
    private readonly actorRepository: ActorRepository,
    private readonly faceapiService: FaceapiService,
    private readonly imgUploadService: ImgUploadService,
    @Inject('CHROMIUM_BROWSER') private browser: Browser,
  ) {}

  async create(actor: ActorDto): Promise<Actor> {
    return this.actorRepository.create(actor);
  }

  async update(id: string, oldActor: UpdateActorDto): Promise<Actor> {
    return this.actorRepository.updateById(id, oldActor);
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
      const wikiData: parsedWikiActor[] = [];
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
    let actorsToParse = names;

    const actors: Actor[] = [];
    for (let i = 0; i < names.length; i++) {
      const actorInDB = await this.actorRepository.findOneByName(names[i]);
      if (!actorInDB) continue;
      //check document age
      //if too old - then reparse it
      const today = moment().startOf('day');
      const documentLastUpdated = moment(actorInDB.updated_at);
      const diff = moment.duration(documentLastUpdated.diff(today)).asDays();
      this.logger.log(`Document age is: ${diff} days`);

      if (diff <= 5) {
        actors.push(actorInDB);
        actorsToParse = actorsToParse.filter((name) => name !== names[i]);
      }
    }
    this.logger.log(`Found actors in db: ${actors.map((a) => a.name)}`);

    if (actorsToParse.length) {
      this.logger.log(`Actors to parse: ${actorsToParse}`);
      for (let i = 0; i < actorsToParse.length; i++) {
        const parsedActor = await this.parseSingleActor(actorsToParse[i]);
        if (parsedActor) {
          const newActor = await this.actorRepository.updateIfNotCreate(
            parsedActor,
          );
          actors.push(newActor);
        }
      }
    }
    return actors;
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
      let successLink = false;

      const page = await this.browser.newPage();

      for (let i = 0; i < links.length; i++) {
        const link = ROTTEN_TOMATOES_CELEB_URL + links[i];
        await page.goto(link);
        this.logger.log('Navigating to: ' + link);

        const testElement = await page.$(TEST_ELEM);
        if (testElement) {
          successLink = true;
          break;
        } else {
          this.logger.log('Link failed: ' + links);
        }
      }

      if (!successLink) return null;

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
          const href = await linkElement.evaluate(
            (e) => e.getAttribute('href') || null,
          );
          if (href) {
            film.link = ROTTEN_TOMATOES_URL + href;
          }

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

  async recogniseActors(imagePath: string): Promise<recogniseActorsType> {
    const { image, names } = await this.faceapiService.recogniseFaces(
      imagePath,
    );
    if (!names.length) return null;
    const imgUrl = await this.imgUploadService.uploadUserHistory(image);
    return {
      names,
      image: imgUrl.secure_url,
    };
  }
}

import { ActorInfo, ActorInfoFull, WikiActorInfo } from '@/types';
import { dataURItoBlob } from '@/utils/dataUriToBlob';
import { ActorDto } from './dto/actor.dto';
import { FilmDto } from './dto/film.dto';
import { recogniseActorsTypeDto } from './dto/recognisedActors.dto';
import { WikiActor } from './dto/WikiActor.dto';
import { Api } from './index';

export const ActorsService = {
  async getActorinfo(name: string) {
    const data: ActorDto = await Api.get(`/actors/name/${name}`);
    return data;
  },

  async getActorFilms(filmNames: string[]) {
    const data: FilmDto[] = await Api.post('/external_apis/omdb', {
      filmNames,
    });
    return data;
  },

  async recogniseActors(base64Photo: string) {
    const formData = new FormData();

    const blob = dataURItoBlob(base64Photo);
    const file = new File([blob], 'actor.jpg', { type: 'image/jpeg' });

    formData.append('file', file);

    const data: recogniseActorsTypeDto = await Api.post(
      '/actors/recognise',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  },

  async getActors(actorNames: string[]) {
    const data: ActorDto[] = await Api.post('/actors/getactors', {
      actorNames,
    });
    return data;
  },

  async searchInfo(
    actorNames: string[],
    imageUrl: string
  ): Promise<Array<ActorInfo>> {
    const data: any = await Api.post('/api/db/parseactors', {
      labels: actorNames,
      time: Date.now(),
      imgUrl: imageUrl,
    });
    //TODO: fix this crap on Backend
    const actorData: ActorInfo[] = data.actorData.reduce(
      (acc: ActorInfo[], curr: any) => {
        let actor = {
          photo: curr.image.url,
          name: curr.name,
          id: curr._id,
          birthPlace: curr.birthPlace.split(':')[1],
          birthDay: curr.birthday.split(':')[1],
        };
        acc.push(actor);
        return acc;
      },
      []
    );
    return actorData;
  },

  async parseWikiActors(actorNames: string[]) {
    const data: WikiActor[] = await Api.post('/actors/parsewikiactors', {
      actorNames,
    });
    return data;
  },

  async fetchFilms() {},
};

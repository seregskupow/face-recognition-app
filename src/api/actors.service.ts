import { ActorInfo, WikiActorInfo } from '@/types';
import { Api } from './index';

export const ActorsService = {
  async getOne() {},

  async searchInfo(
    actorNames: string[],
    imageUrl: string
  ): Promise<Array<ActorInfo>> {
    const data: any = await Api.post('/api/db/parseactors', {
      labels: actorNames,
      time: Date.now(),
      imgUrl: imageUrl
    });
    //TODO: fix this crap on Backend
    const actorData: ActorInfo[] = data.actorData.reduce(
      (acc: ActorInfo[], curr: any) => {
        let actor = {
          photo: curr.image.url,
          name: curr.name,
          id: curr._id,
          birthPlace: curr.birthPlace.split(':')[1],
          birthDay: curr.birthday.split(':')[1]
        };
        acc.push(actor);
        return acc;
      },
      []
    );
    return actorData;
  },

  async parseWikiActors(actorNames: string[]): Promise<WikiActorInfo[]> {
    const data: WikiActorInfo[] = await Api.post('/api/db/parsewikiactors', {
      actorNames
    });
    return data;
  },

  async fetchFilms() {}
};

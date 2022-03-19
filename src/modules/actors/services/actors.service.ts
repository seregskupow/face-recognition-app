import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { parseOGMetatags } from '@utils/parseOG';
import { Model, Types } from 'mongoose';
import { ActorDto } from '../dto/actor.dto';
import { UpdateActorDto } from '../dto/update-actor.dto';
import { ActorRepository } from '../repositories/actor.repository';
import { Actor, ActorDocument } from '../schemas/actor.schema';

@Injectable()
export class ActorService {
  constructor(private readonly actorRepository: ActorRepository) {}

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

  async parseActors(names: string[]) {}
}

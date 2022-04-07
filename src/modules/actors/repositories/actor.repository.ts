import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { isValidObjectId, Model, Types } from 'mongoose';
import { ActorDto } from '../dto/actor.dto';
import { UpdateActorDto } from '../dto/update-actor.dto';
import { Actor, ActorDocument } from '../schemas/actor.schema';

@Injectable()
export class ActorRepository {
  constructor(
    @InjectModel(Actor.name) private actorModel: Model<ActorDocument>,
  ) {}

  async create(actor: ActorDto): Promise<Actor> {
    const newActor = new this.actorModel(actor);
    return newActor.save();
  }

  async updateById(
    id: string,
    oldActor: UpdateActorDto,
    upsert?: false,
  ): Promise<Actor> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Provided id is invalid');
    }

    return this.actorModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        {
          ...oldActor,
        },
        { new: true, upsert: upsert },
      )
      .exec();
  }

  async updateIfNotCreate(actor: UpdateActorDto): Promise<Actor> {
    return this.actorModel
      .findOneAndUpdate(
        { name: actor.name },
        {
          ...actor,
          updated_at: new Date().toISOString(),
        },
        { new: true, upsert: true },
      )
      .exec();
  }

  delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Provided id is invalid');
    }
    return this.actorModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  findOneById(id: string): Promise<Actor> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Provided id is invalid');
    }
    return this.actorModel.findById(new Types.ObjectId(id)).exec();
  }

  findOneByName(name: string): Promise<Actor> {
    return this.actorModel.findOne({ name }).exec();
  }

  findAll(): Promise<Actor[]> {
    return this.actorModel.find().exec();
  }
}

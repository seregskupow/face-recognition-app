import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
    const newActor = await this.actorModel.create(actor);
    return newActor;
  }

  async update(id: string, oldActor: UpdateActorDto): Promise<Actor> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Provided id is invalid');
    }

    return this.actorModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        {
          ...oldActor,
        },
        { new: true },
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

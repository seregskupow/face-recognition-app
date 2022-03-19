import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActorsController } from './actors.controller';
import { ActorService } from './services/actors.service';
import { Actor, ActorSchema } from './schemas/actor.schema';
import { ActorRepository } from './repositories/actor.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Actor.name, schema: ActorSchema }]),
  ],
  controllers: [ActorsController],
  providers: [ActorService, ActorRepository],
  exports: [ActorService],
})
export class ActorsModule {}

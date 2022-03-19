import { Controller, Get } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';
import { ActorService } from './services/actors.service';

@Controller('actors')
export class ActorsController {
  constructor(private actorService: ActorService) {}

  @Get('create')
  async create() {
    // const actor = await this.actorService.create({
    //   name: 'Serega2',
    //   photo: null,
    //   biography: 'sadasdasdsad',
    //   birthDay: '27.12.2001',
    //   birthPlace: 'Kyiv',
    //   films: [
    //     {
    //       link: 'http://asdasd.com',
    //       poster: 'sadasdsad',
    //       title: 'james bond',
    //     },
    //     {
    //       link: 'http://asdasasdasdd.com',
    //       poster: 'sadasdsad',
    //       title: 'james bond2',
    //     },
    //   ],
    // });
    // return actor;
    const res = await this.actorService.findOneById('5e3338ba80f8cf1300aa430f');
    return res;
  }
}

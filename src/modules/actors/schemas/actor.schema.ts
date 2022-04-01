import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Exclude } from 'class-transformer';

@Schema({ _id: false })
export class Film {
  @Prop()
  poster: string;

  @Prop()
  link: string;

  @Prop()
  title: string;
}

export type FilmDocument = Film & Document;

export const FilmSchema = SchemaFactory.createForClass(Film);

@Schema({
  collection: 'actors',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Actor {
  @Exclude()
  _id: string;

  @Prop({ required: true, min: 1, max: 255 })
  name: string;

  @Prop()
  photo: string;

  @Prop()
  birthDay: string;

  @Prop()
  birthPlace: string;

  @Prop()
  biography: string;

  @Prop({ type: [FilmSchema] })
  films: Film[];
}

export type ActorDocument = Actor & Document;

export const ActorSchema = SchemaFactory.createForClass(Actor);

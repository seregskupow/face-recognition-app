import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Exclude } from 'class-transformer';
import { Actor } from '@modules/actors/schemas/actor.schema';
import { User } from './user.schema';

export type UserHistoryDocument = UserHistory & Document;

@Schema({ collection: 'user_history' })
export class UserHistory {
  @Exclude()
  _id: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Actor' }] })
  actors: Actor[];

  @Prop()
  usedImage: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const UserHistorySchema = SchemaFactory.createForClass(UserHistory);

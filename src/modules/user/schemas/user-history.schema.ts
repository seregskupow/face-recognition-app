import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Exclude } from 'class-transformer';
import { User } from './user.schema';

export type UserHistoryDocument = UserHistory & Document;

@Schema({ collection: 'user_history' })
export class UserHistory {
  @Exclude()
  _id: string;

  @Prop({ type: [String] })
  actors: string[];

  @Prop()
  usedImage: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
}

export const UserHistorySchema = SchemaFactory.createForClass(UserHistory);

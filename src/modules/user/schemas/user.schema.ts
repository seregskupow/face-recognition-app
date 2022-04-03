import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  @Exclude()
  _id: string;

  @Prop({ required: true, min: 6, max: 255 })
  name?: string;

  @Prop({ required: true, min: 6, max: 255 })
  email?: string;

  @Prop()
  @Exclude()
  password?: string;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ default: null })
  @Exclude()
  googleId?: string;

  @Prop({ default: false })
  @Exclude()
  activated?: boolean;

  @Exclude()
  __v?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

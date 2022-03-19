import { Types } from 'mongoose';

export class UserHistoryDto {
  readonly actors: Types.ObjectId[];

  readonly owner: Types.ObjectId;

  readonly createdAt?: Date;
}

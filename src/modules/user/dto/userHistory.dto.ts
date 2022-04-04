import { Types } from 'mongoose';

export class UserHistoryDto {
  readonly actors: string[];

  readonly owner: string;

  readonly createdAt?: Date;
}

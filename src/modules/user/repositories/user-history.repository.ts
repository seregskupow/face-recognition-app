import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { UserHistoryDto } from '../dto/userHistory.dto';
import {
  UserHistory,
  UserHistoryDocument,
} from '../schemas/user-history.schema';

@Injectable()
export class UserHistoryRepository {
  constructor(
    @InjectModel(UserHistory.name)
    private userHistoryModel: Model<UserHistoryDocument>,
  ) {}

  create(dto: UserHistoryDto): Promise<UserHistory> {
    const userHistory = new this.userHistoryModel(dto);
    return userHistory.save();
  }

  delete(userId: string, historyId: string) {
    if (!isValidObjectId(userId) || !isValidObjectId(historyId)) {
      throw new BadRequestException('Provided id is invalid');
    }
    return this.userHistoryModel
      .findOneAndDelete({
        id: new Types.ObjectId(historyId),
        owner: new Types.ObjectId(userId),
      })
      .exec();
  }

  deleteAll(userId: string) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Provided id is invalid');
    }
    return this.userHistoryModel
      .deleteMany({ owner: new Types.ObjectId(userId) })
      .exec();
  }

  getRecords(userId: string, pageNumber = 0, limit = 10) {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Provided id is invalid');
    }
    return this.userHistoryModel
      .aggregate()
      .match({ owner: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .skip(pageNumber * limit)
      .limit(limit)
      .lookup({
        from: 'actors',
        localField: 'actors',
        foreignField: '_id',
        as: 'actorData',
      })
      .project({
        'actorData.films': 0,
        'actorData.birthPlace': 0,
        'actorData.birthDay': 0,
        'actorData.biography': 0,
        'actorData.__v': 0,
      })
      .group({
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        results: {
          $push: {
            actors: '$actorData',
            usedImage: '$usedImage',
            id: '$_id',
          },
        },
      })
      .project({
        date: '$_id',
        results: 1,
        _id: 0,
      })
      .sort({ date: -1 })
      .exec();
  }
}

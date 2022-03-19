import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserHistoryDto } from '../dto/userHistory.dto';
import { UserHistoryRepository } from '../repositories/user-history.repository';
import { UserHistory } from '../schemas/user-history.schema';

@Injectable()
export class UserHistoryService {
  constructor(private readonly userHistoryRepository: UserHistoryRepository) {}

  create(dto: UserHistoryDto): Promise<UserHistory> {
    return this.userHistoryRepository.create(dto);
  }

  delete(userId: string, historyId: string) {
    return this.userHistoryRepository.delete(userId, historyId);
  }

  deleteAll(userId: string) {
    return this.userHistoryRepository.deleteAll(userId);
  }

  getRecords(userId: string, pageNumber = 0, limit = 10) {
    return this.userHistoryRepository.getRecords(userId, pageNumber, limit);
  }
}

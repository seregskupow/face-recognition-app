import { Test, TestingModule } from '@nestjs/testing';
import { UserHistoryService } from './user-history.service';

describe('UserHistoryService', () => {
  let service: UserHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHistoryService],
    }).compile();

    service = module.get<UserHistoryService>(UserHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

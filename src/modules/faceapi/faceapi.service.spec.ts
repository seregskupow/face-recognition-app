import { Test, TestingModule } from '@nestjs/testing';
import { FaceapiService } from './faceapi.service';

describe('FaceapiService', () => {
  let service: FaceapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaceapiService],
    }).compile();

    service = module.get<FaceapiService>(FaceapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

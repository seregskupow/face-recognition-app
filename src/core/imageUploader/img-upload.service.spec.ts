import { Test, TestingModule } from '@nestjs/testing';
import { ImgUploadService } from './img-upload.service';

describe('ImgUploadService', () => {
  let service: ImgUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImgUploadService],
    }).compile();

    service = module.get<ImgUploadService>(ImgUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

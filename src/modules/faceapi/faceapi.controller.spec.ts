import { Test, TestingModule } from '@nestjs/testing';
import { FaceapiController } from './faceapi.controller';

describe('FaceapiController', () => {
  let controller: FaceapiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaceapiController],
    }).compile();

    controller = module.get<FaceapiController>(FaceapiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

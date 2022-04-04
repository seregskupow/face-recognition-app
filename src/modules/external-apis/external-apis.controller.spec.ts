import { Test, TestingModule } from '@nestjs/testing';
import { ExternalApisController } from './external-apis.controller';

describe('ExternalApisController', () => {
  let controller: ExternalApisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalApisController],
    }).compile();

    controller = module.get<ExternalApisController>(ExternalApisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

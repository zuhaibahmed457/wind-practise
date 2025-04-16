import { Test, TestingModule } from '@nestjs/testing';
import { DegreeTypeController } from './degree-type.controller';
import { DegreeTypeService } from './degree-type.service';

describe('DegreeTypeController', () => {
  let controller: DegreeTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DegreeTypeController],
      providers: [DegreeTypeService],
    }).compile();

    controller = module.get<DegreeTypeController>(DegreeTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

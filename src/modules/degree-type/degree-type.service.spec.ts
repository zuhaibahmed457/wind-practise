import { Test, TestingModule } from '@nestjs/testing';
import { DegreeTypeService } from './degree-type.service';

describe('DegreeTypeService', () => {
  let service: DegreeTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DegreeTypeService],
    }).compile();

    service = module.get<DegreeTypeService>(DegreeTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

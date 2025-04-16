import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentTypeService } from './employment-type.service';

describe('EmploymentTypeService', () => {
  let service: EmploymentTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmploymentTypeService],
    }).compile();

    service = module.get<EmploymentTypeService>(EmploymentTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

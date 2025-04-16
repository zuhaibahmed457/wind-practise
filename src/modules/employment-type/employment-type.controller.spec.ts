import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentTypeController } from './employment-type.controller';
import { EmploymentTypeService } from './employment-type.service';

describe('EmploymentTypeController', () => {
  let controller: EmploymentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmploymentTypeController],
      providers: [EmploymentTypeService],
    }).compile();

    controller = module.get<EmploymentTypeController>(EmploymentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

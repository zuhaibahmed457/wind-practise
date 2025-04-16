import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicantController } from './job_applicant.controller';
import { JobApplicantService } from './job_applicant.service';

describe('JobApplicantController', () => {
  let controller: JobApplicantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobApplicantController],
      providers: [JobApplicantService],
    }).compile();

    controller = module.get<JobApplicantController>(JobApplicantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

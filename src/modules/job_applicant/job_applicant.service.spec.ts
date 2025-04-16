import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicantService } from './job_applicant.service';

describe('JobApplicantService', () => {
  let service: JobApplicantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobApplicantService],
    }).compile();

    service = module.get<JobApplicantService>(JobApplicantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

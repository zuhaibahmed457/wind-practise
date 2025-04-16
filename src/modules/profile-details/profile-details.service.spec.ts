import { Test, TestingModule } from '@nestjs/testing';
import { ProfileDetailsService } from './profile-details.service';

describe('ProfileDetailsService', () => {
  let service: ProfileDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileDetailsService],
    }).compile();

    service = module.get<ProfileDetailsService>(ProfileDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

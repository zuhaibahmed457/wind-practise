import { Module } from '@nestjs/common';
import { JobApplicantService } from './job_applicant.service';
import { JobApplicantController } from './job_applicant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicant } from './entities/job_applicant.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
import { SharedModule } from 'src/shared/shared.module';
import { AccessRequest } from '../access-request/entities/access-request.entity';
@Module({
  imports: [TypeOrmModule.forFeature([JobApplicant, JobPost, AccessRequest]), SharedModule],
  controllers: [JobApplicantController],
  providers: [JobApplicantService],
})
export class JobApplicantModule {}

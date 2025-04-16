import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job-post.entity';
import { SharedModule } from 'src/shared/shared.module';
import { Designation } from '../designation/entities/designation.entity';
import { EmploymentType } from '../employment-type/entities/employment-type.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, Designation, EmploymentType]), SharedModule, NotificationsModule],
  controllers: [JobPostController],
  providers: [JobPostService],
})
export class JobPostModule {}

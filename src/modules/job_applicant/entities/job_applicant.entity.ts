import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum JobApplicantStatus {
  APPLIED = 'applied',
  VIEWED = 'viewed',
  ACCEPT = 'accept',
  REJECT = 'reject',
}

@Entity('job_applicant')
export class JobApplicant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: JobApplicantStatus,
    default: JobApplicantStatus.APPLIED,
  })
  status: JobApplicantStatus;

  @CreateDateColumn()
  applied_at: Date;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.job_applicants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'job_post_id' })
  job_post: JobPost;

  @ManyToOne(() => ProfileDetails, (profile) => profile.job_applicants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_details_id' })
  profile_detail: ProfileDetails;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

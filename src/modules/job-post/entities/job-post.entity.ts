import { Designation } from 'src/modules/designation/entities/designation.entity';
import { EmploymentType } from 'src/modules/employment-type/entities/employment-type.entity';
import { JobApplicant } from 'src/modules/job_applicant/entities/job_applicant.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

export enum JobStatus {
  ACITVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('job-post')
export class JobPost extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  min_salary: number;

  @Column({ nullable: true })
  max_salary: number;

  @Column({ nullable: true })
  min_experience: number;

  @Column({ nullable: true })
  max_experience: number;

  @Column('text', { array: true, nullable: true })
  qualification: string[];

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.ACITVE,
  })
  status: JobStatus;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_archive: boolean;

  @Column({ nullable: true, default: 0 })
  applicant_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.job_post)
  @JoinColumn({ name: 'organization_id' })
  user: User;

  @ManyToMany(() => EmploymentType, { onDelete: 'CASCADE' })
  @JoinTable()
  job_type: EmploymentType[];

  @ManyToMany(() => Designation, { onDelete: 'CASCADE' })
  @JoinTable()
  designation_type: Designation[];

  @OneToMany(() => JobApplicant, (applicant) => applicant.job_post)
  job_applicants: JobApplicant[];
}

import { Designation } from 'src/modules/designation/entities/designation.entity';
import { EmploymentType } from 'src/modules/employment-type/entities/employment-type.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Skill } from 'src/modules/skills/entities/skill.entity';
import { Education } from 'src/modules/education/entities/education.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Portfolio } from 'src/modules/portfolio/entities/portfolio.entity';
import { JobApplicant } from 'src/modules/job_applicant/entities/job_applicant.entity';
import { AccessRequest } from 'src/modules/access-request/entities/access-request.entity';

@Entity('profile_details')
export class ProfileDetails extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  tagline: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ nullable: true })
  join_date: Date;

  @Column({ nullable: true })
  linkedin_url: string;

  @Column({ nullable: true })
  facebook_url: string;

  @Column({ nullable: true })
  twitter_url: string;

  @Column({ nullable: true })
  website_url: string;

  @Column({ nullable: true })
  soonest_expiring_certificate_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // Relations

  @ManyToOne(() => Designation, (designation) => designation.profile_details, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

  @ManyToOne(
    () => EmploymentType,
    (employmentType) => employmentType.profile_details,
    { nullable: true, onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'employment_type_id' })
  employment_type: EmploymentType;

  @OneToMany(() => Education, (education) => education.profile_details)
  educations: Education[];

  @OneToMany(() => Skill, (skill) => skill.profile_details)
  skills: Skill[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.profile_details)
  portfolio: Portfolio[];

  @OneToMany(() => JobApplicant, (applicant) => applicant.profile_detail)
  job_applicants: JobApplicant[];

  @OneToMany(() => AccessRequest, (request) => request.requested_from)
  access_requests: AccessRequest[];

  @OneToOne(() => User, (user) => user.profile_detail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

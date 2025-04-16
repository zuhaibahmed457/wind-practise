import { LoginAttempt } from 'src/modules/auth/entities/login-attempt.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Otp } from 'src/modules/auth/entities/otp.entity';
import { Designation } from 'src/modules/designation/entities/designation.entity';
import { EmploymentType } from 'src/modules/employment-type/entities/employment-type.entity';
import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { Subscription } from 'src/modules/subscriptions/entities/subscription.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { UserNotification } from 'src/modules/notifications/entities/user-notification.entity';
import { UserNotificationSetting } from 'src/modules/notifications/entities/user-notification-setting.entity';
import { AccessRequest } from 'src/modules/access-request/entities/access-request.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  ORGANIZATION = 'organization',
  EMPLOYEE = 'employee',
  TECHNICIAN = 'technician',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserCardStatus {
  NO_CARD = 'no_card',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  banner_image: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  phone_no: string;

  @Column({ nullable: true })
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  stripe_customer_id: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.TECHNICIAN })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ default: false })
  has_used_free_trial: boolean;

  @Column({ default: false })
  has_taken_subscription: boolean;

  @Column({ nullable: true })
  time_zone: string;

  @Column({ nullable: true })
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => LoginAttempt, (loginAttempt) => loginAttempt.user)
  login_attempts: LoginAttempt[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @OneToMany(() => Designation, (designation) => designation.created_by)
  designations: Designation[];

  @OneToMany(() => EmploymentType, (employment) => employment.created_by)
  employment_types: EmploymentType[];

  @OneToOne(() => ProfileDetails, (profileDetails) => profileDetails.user)
  profile_detail: ProfileDetails;

  @OneToOne(
    () => UserNotificationSetting,
    (userNotificationSetting) => userNotificationSetting.user,
  )
  user_notification_setting: UserNotificationSetting;

  @OneToOne(() => Subscription, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'latest_subscription_id' })
  latest_subscription: Subscription;

  @OneToMany(() => JobPost, (job) => job.user)
  job_post: JobPost[];

  // TODO: Self-referencing relationship to track which user (Organization) created an Employee.
  @ManyToOne(() => User, (user) => user.created_employees, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  // TODO: Self-referencing relationship to track all Employees created by a User (Organization).
  @OneToMany(() => User, (user) => user.created_by)
  created_employees: User[];

  @OneToMany(
    () => UserNotification,
    (userNotification) => userNotification.user,
  )
  user_notifications: UserNotification[];

  @OneToMany(() => AccessRequest, (request) => request.requested_by)
  access_requests: AccessRequest[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
 
  @BeforeInsert()
  @BeforeUpdate()
  async createfullName(): Promise<void> {
    if (this.first_name && this.last_name) {
      this.full_name = `${this.first_name} ${this.last_name}`
    }
  }

  async comparePassword(receivedPassword: string) {
    return bcrypt.compare(receivedPassword, this.password);
  }
}

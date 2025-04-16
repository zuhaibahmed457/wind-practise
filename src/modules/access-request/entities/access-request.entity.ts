import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied',
}

export enum RequestType {
  PORTFOLIO = 'portfolio',
  CERTIFICATE = 'certificate',
}

export enum RequestPurpose {
  AUTO_ACCESS = 'Auto access granted',
  USER_REQUESTED = 'User requested access',
}

@Entity()
export class AccessRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  requested_from: string;

  @Column({
    type: 'enum',
    enum: RequestType,
    array: true, 
    default: [RequestType.PORTFOLIO, RequestType.CERTIFICATE],
  })
  request_type: RequestType[];

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({
    type: 'enum',
    enum: RequestPurpose,
    default: RequestPurpose.USER_REQUESTED,
  })
  purpose: RequestPurpose;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => ProfileDetails, (profile) => profile.access_requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requested_by_id' })
  requested_by: ProfileDetails;
}

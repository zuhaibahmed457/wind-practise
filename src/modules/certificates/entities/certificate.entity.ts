import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'certificate' })
export class Certificate extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  issuing_authority: string;

  @Column()
  issuing_date: Date;

  @Column()
  expiration_date: Date;

  @Column()
  notification_date: Date; // ** When the date reaches will start notifying the created_by => when organization or user => when technician

  @Column({ nullable: true })
  last_notified_at: Date;

  @Column()
  certificate_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => ProfileDetails)
  @JoinColumn({ name: 'profile_details_id' })
  profile_details: ProfileDetails;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;
}

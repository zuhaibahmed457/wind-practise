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
} from 'typeorm';

@Entity('technician_portfolio')
export class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  project_name: string;

  @Column()
  industry: string;

  @Column()
  project_duration: number;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(
    () => ProfileDetails,
    (profileDetails) => profileDetails.portfolio,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'profile_details_id' })
  profile_details: ProfileDetails;
}

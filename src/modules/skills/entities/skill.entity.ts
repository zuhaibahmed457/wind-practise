import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
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
} from 'typeorm';

@Entity()
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => ProfileDetails, (profileDetails) => profileDetails.skills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_detail_id' })
  profile_details: ProfileDetails;
}

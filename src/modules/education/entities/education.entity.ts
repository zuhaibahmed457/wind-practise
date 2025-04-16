import { DegreeType } from 'src/modules/degree-type/entities/degree-type.entity';
import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
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

@Entity()
export class Education extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  field: string;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => ProfileDetails, (profileDetails) => profileDetails.educations, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'profile_detail_id' })
  profile_details: ProfileDetails;

  @ManyToOne(() => DegreeType, (degree) => degree.educations, {onDelete: 'SET NULL'})
  @JoinColumn({ name: 'degree_type_id' })
  degree_type: DegreeType[];
}

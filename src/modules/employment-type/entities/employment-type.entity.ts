import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
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
  OneToMany,
} from 'typeorm';

export enum EmploymentTypeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('employment_types')
export class EmploymentType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: EmploymentTypeStatus,
    default: EmploymentTypeStatus.ACTIVE,
  })
  status: EmploymentTypeStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.employment_types, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @OneToMany(() => ProfileDetails, (profile) => profile.employment_type)
  profile_details: ProfileDetails[];
}

import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum DesignationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('designations')
export class Designation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DesignationStatus,
    default: DesignationStatus.ACTIVE,
  })
  status: DesignationStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.designations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @OneToMany(() => ProfileDetails, (profile) => profile.designation)
  profile_details: ProfileDetails[];
}

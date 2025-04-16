import { Subscription } from 'src/modules/subscriptions/entities/subscription.entity';
import { UserRole } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PlanFor {
  ORGANIZATION = UserRole.ORGANIZATION,
  TECHNICIAN = UserRole.TECHNICIAN,
}
export enum PlanType {
  FREE = 'free',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum PlanStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('plan')
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: PlanType })
  type: PlanType;

  @Column({ type: 'enum', enum: PlanFor })
  for: PlanFor;

  @Column({ nullable: true })
  stripe_product_id: string; // ** Regular Features (Non-functional strings)

  @Column({ type: 'int', nullable: true, default: null })
  number_of_employees_allowed: number | null; // ** Effective Feature

  @Column('text', { array: true, nullable: false })
  features: string[];

  @Column({ nullable: true })
  free_duration: number; // ** number of days

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  stripe_price_id: string;

  @Column({ type: 'enum', enum: PlanStatus, default: PlanStatus.ACTIVE })
  status: PlanStatus;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

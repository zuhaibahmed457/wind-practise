import { Invoice } from 'src/modules/invoices/entities/invoice.entity';
import { Plan } from 'src/modules/plans/entities/plan.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due', // WHEN THE RECURRENT PAYMENT FAILS
  CANCELED = 'canceled', // When the subscription ended
}

export enum PaymentStatus {
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity('subscription')
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.0' })
  price: number;

  @Column({ nullable: true })
  stripe_subscription_id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ default: false })
  cancel_at_period_end: boolean;

  @Column({ default: 0 })
  payment_failed_count: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PAID,
  })
  payment_status: PaymentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToMany(() => Invoice, (invoice) => invoice.subscription)
  invoices: Invoice[];
}

import { Invoice } from 'src/modules/invoices/entities/invoice.entity';
import { Plan } from 'src/modules/plans/entities/plan.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    PAST_DUE = "past_due",
    CANCELED = "canceled"
}
export declare enum PaymentStatus {
    PAID = "paid",
    FAILED = "failed"
}
export declare class Subscription extends BaseEntity {
    id: string;
    price: number;
    stripe_subscription_id: string;
    status: SubscriptionStatus;
    start_date: Date;
    end_date: Date;
    cancel_at_period_end: boolean;
    payment_failed_count: number;
    payment_status: PaymentStatus;
    created_at: Date;
    updated_at: Date;
    user: User;
    plan: Plan;
    invoices: Invoice[];
}

import { Subscription } from 'src/modules/subscriptions/entities/subscription.entity';
import { User } from 'src/modules/users/entities/user.entity';
export declare enum InvoiceStatus {
    PAID = "paid"
}
export declare class Invoice {
    id: string;
    stripe_invoice_id: string;
    stripe_hosted_invoice_url: string;
    stripe_invoice_pdf: string;
    status: InvoiceStatus;
    amount_paid: number;
    amount_due: number;
    due_date: Date;
    payment_date: Date;
    failure_reason: string;
    retries_count: number;
    created_at: Date;
    updated_at: Date;
    subscription: Subscription;
    user: User;
}

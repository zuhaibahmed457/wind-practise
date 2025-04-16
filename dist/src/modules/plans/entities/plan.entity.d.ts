import { Subscription } from 'src/modules/subscriptions/entities/subscription.entity';
import { BaseEntity } from 'typeorm';
export declare enum PlanFor {
    ORGANIZATION = "organization",
    TECHNICIAN = "technician"
}
export declare enum PlanType {
    FREE = "free",
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
export declare enum PlanStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class Plan extends BaseEntity {
    id: string;
    name: string;
    description: string;
    type: PlanType;
    for: PlanFor;
    stripe_product_id: string;
    number_of_employees_allowed: number | null;
    features: string[];
    free_duration: number;
    price: number;
    stripe_price_id: string;
    status: PlanStatus;
    subscriptions: Subscription[];
    created_at: Date;
    updated_at: Date;
}

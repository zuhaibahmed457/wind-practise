import Stripe from 'stripe';
import { DataSource } from 'typeorm';
export declare const createPlansForOrganization: (AppDateSource: DataSource, stripe: Stripe) => Promise<void>;

import Stripe from 'stripe';
import { DataSource } from 'typeorm';
export declare const createPlansForTechnician: (AppDateSource: DataSource, stripe: Stripe) => Promise<void>;

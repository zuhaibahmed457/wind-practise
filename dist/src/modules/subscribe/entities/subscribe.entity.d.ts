import { BaseEntity } from 'typeorm';
export declare class Subscribe extends BaseEntity {
    id: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}

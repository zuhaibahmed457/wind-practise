import { ContactUs } from 'src/modules/contact-us/entities/contact-us.entity';
import { BaseEntity } from 'typeorm';
export declare class Subject extends BaseEntity {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    contactUs: ContactUs[];
}

import { Subject } from 'src/modules/subject/entities/subject.entity';
import { BaseEntity } from 'typeorm';
export declare class ContactUs extends BaseEntity {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    subject: Subject;
}

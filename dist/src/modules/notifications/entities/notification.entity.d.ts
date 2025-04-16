import { BaseEntity } from 'typeorm';
import { UserNotification } from './user-notification.entity';
import { EmailTemplate } from '../enums/email-template.enum';
export declare enum NotificationEntityType {
    CERTIFICATE = "certificate",
    SUBSCRIPTION = "subscription",
    EMPLOYEE = "employee",
    OTP = "otp",
    ACCESS_REQUEST = "access_request",
    JOB_APPLICANT = "job_applicant",
    JOB_POST = "job_post",
    OTHER = "other"
}
export declare enum NotificationType {
    TRANSACTION = "transactional",
    NON_TRANSACTIONAL = "non_transactional"
}
export declare enum NotificationChannel {
    EMAIL = "email",
    IN_APP = "in_app"
}
export declare class Notification extends BaseEntity {
    id: string;
    title: string;
    message: string;
    notification_type: NotificationType;
    template: EmailTemplate;
    channels: NotificationChannel[];
    entity_type: NotificationEntityType;
    entity_id: string | null;
    created_at: Date;
    user_notifications: UserNotification[];
}

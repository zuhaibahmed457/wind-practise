import { LoginAttempt } from 'src/modules/auth/entities/login-attempt.entity';
import { BaseEntity } from 'typeorm';
import { Otp } from 'src/modules/auth/entities/otp.entity';
import { Designation } from 'src/modules/designation/entities/designation.entity';
import { EmploymentType } from 'src/modules/employment-type/entities/employment-type.entity';
import { ProfileDetails } from 'src/modules/profile-details/entities/profile-details.entity';
import { Subscription } from 'src/modules/subscriptions/entities/subscription.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { UserNotification } from 'src/modules/notifications/entities/user-notification.entity';
import { UserNotificationSetting } from 'src/modules/notifications/entities/user-notification-setting.entity';
import { AccessRequest } from 'src/modules/access-request/entities/access-request.entity';
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    ORGANIZATION = "organization",
    EMPLOYEE = "employee",
    TECHNICIAN = "technician"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare enum UserCardStatus {
    NO_CARD = "no_card",
    INACTIVE = "inactive",
    ACTIVE = "active"
}
export declare class User extends BaseEntity {
    id: string;
    profile_image: string;
    banner_image: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone_no: string;
    email: string;
    password: string;
    stripe_customer_id: string;
    role: UserRole;
    status: UserStatus;
    has_used_free_trial: boolean;
    has_taken_subscription: boolean;
    time_zone: string;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
    login_attempts: LoginAttempt[];
    otps: Otp[];
    designations: Designation[];
    employment_types: EmploymentType[];
    profile_detail: ProfileDetails;
    user_notification_setting: UserNotificationSetting;
    latest_subscription: Subscription;
    job_post: JobPost[];
    created_by: User;
    created_employees: User[];
    user_notifications: UserNotification[];
    access_requests: AccessRequest[];
    hashPassword(): Promise<void>;
    createfullName(): Promise<void>;
    comparePassword(receivedPassword: string): Promise<any>;
}

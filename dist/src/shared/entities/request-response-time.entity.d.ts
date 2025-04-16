import { BaseEntity } from 'typeorm';
export declare class RequestResponseTime extends BaseEntity {
    id: string;
    request_time: Date;
    response_time: Date;
    duration: number;
    request: string;
    response: string;
    created_at: Date;
}

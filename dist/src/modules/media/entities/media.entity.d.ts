import { BaseEntity } from 'typeorm';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
    PDF = "pdf"
}
export declare enum EntityType {
    PORTFOLIO = "portfolio",
    USER = "user",
    SUBSCRIPTION = "subscription",
    CERTIFICATE = "certificate"
}
export declare class Media extends BaseEntity {
    id: string;
    type: MediaType;
    url: string;
    entity_id: string;
    entity_type: EntityType;
    created_at: Date;
}

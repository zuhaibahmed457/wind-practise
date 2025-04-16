import { Education } from "src/modules/education/entities/education.entity";
import { BaseEntity } from "typeorm";
export declare class DegreeType extends BaseEntity {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    educations: Education[];
}

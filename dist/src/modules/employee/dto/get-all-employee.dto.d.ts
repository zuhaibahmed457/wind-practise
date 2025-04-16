import { UserStatus } from 'src/modules/users/entities/user.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class GetAllEmployeeDto extends GetAllDto {
    status: UserStatus;
    order?: 'ASC' | 'DESC';
    designation_id: string[];
    employment_type_id: string[];
    join_date_from: Date;
    join_date_to: Date;
    country: string;
    city: string;
}

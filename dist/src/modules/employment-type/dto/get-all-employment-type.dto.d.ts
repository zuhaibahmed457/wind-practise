import { EmploymentTypeStatus } from '../entities/employment-type.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class GetAllEmploymentTypeDto extends GetAllDto {
    status?: EmploymentTypeStatus;
}

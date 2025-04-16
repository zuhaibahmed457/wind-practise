import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { DesignationStatus } from '../entities/designation.entity';
export declare class GetAllDesignationDto extends GetAllDto {
    status: DesignationStatus;
}

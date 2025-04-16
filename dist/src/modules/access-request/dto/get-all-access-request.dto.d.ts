import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { RequestStatus } from '../entities/access-request.entity';
export declare class GetAllAccessRequestDto extends GetAllDto {
    status: RequestStatus;
}

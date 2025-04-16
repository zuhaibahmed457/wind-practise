import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { RequestStatus, RequestType } from '../entities/access-request.entity';
import { IsEnum, IsOptional } from 'class-validator';
export class GetAllAccessRequestDto extends GetAllDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  status: RequestStatus;
}

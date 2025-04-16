import { IsEnum, IsNotEmpty } from 'class-validator';
import { RequestStatus } from '../entities/access-request.entity';

export class ManageAccessRequestDto {
  @IsEnum(RequestStatus)
  @IsNotEmpty()
  status: RequestStatus;
}

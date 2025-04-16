import { IsOptional, IsUUID } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

export class GetAllEducationDto extends GetAllDto {
  @IsUUID('all', { message: 'Invalid id ' })
  @IsOptional()
  profile_details_id: string;
}

import { IsOptional, IsUUID } from 'class-validator';

export class GetAllProfileDetailsDto {
  @IsUUID('all', { message: 'Invalid id' })
  @IsOptional()
  profile_details_id: string;
}

import { IsOptional, IsUUID } from 'class-validator';

export class GetPortfolioDto {
  @IsUUID('all', { message: 'Invalid id' })
  @IsOptional()
  profile_details_id: string;
}

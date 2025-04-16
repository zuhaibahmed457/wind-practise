import { IsOptional, IsString } from 'class-validator';

export class RevenueStatsDto {
  @IsOptional()
  @IsString()
  year: string;
}

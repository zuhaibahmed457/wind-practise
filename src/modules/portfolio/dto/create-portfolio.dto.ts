import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  project_name: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  project_duration: number;

  @IsString()
  @IsNotEmpty()
  description: string;

}

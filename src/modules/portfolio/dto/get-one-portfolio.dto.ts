import { Transform } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';

export class GetOnePortfolioDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'invalid email format' })
  @IsOptional()
  email: string;
}

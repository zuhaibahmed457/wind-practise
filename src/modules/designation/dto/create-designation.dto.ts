import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateDesignationDto {
  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'name should not contain special characters!',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}

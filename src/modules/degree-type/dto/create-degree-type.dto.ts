import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateDegreeTypeDto {
  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Length(3, 50, {
    message: 'degree name must be 3 to 50 characters long',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

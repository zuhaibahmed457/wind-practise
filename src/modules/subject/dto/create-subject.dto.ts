import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateSubjectDto {
  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'name should not contain special characters!',
  })
  @Length(3, 80, {
    message: 'name must be 3 to 80 characters long',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

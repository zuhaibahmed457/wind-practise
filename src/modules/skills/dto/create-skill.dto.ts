import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateSkillDto {
  @Transform(({ value }) =>
    `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim(),
  )
  @Matches(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
    message: 'skill name should not contain special characters!',
  })
  @Length(3, 50, {
    message: 'skill name must be 3 to 50 characters long',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

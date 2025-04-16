// src/dto/create-contact-us.dto.ts
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

export class CreateContactUsDto {
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

  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsString()
  @IsNotEmpty()
  subject_id: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

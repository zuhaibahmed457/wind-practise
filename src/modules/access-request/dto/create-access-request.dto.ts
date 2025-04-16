import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAccessRequestDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail({}, { message: 'invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  requested_by_id: string;
}
